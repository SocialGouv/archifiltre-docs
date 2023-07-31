import type { HashesMap } from "@common/utils/hashes-types";
import type { TFunction } from "i18next";
import { compose, constant, property, sortBy, toString } from "lodash/fp";
import { extname } from "path";

import type { CsvExportData } from "../../exporters/csv/csv-exporter-types";
import {
  getDepthFromPath,
  isFile,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { MetadataByEntity } from "../../reducers/metadata/metadata-types";
import type { SedaMetadataMapping } from "../../reducers/seda-configuration/seda-configuration-type";
import type { Tag } from "../../reducers/tags/tags-types";
import type { DuplicatesMap } from "../duplicates";
import { hasDuplicateInDuplicatesMap } from "../duplicates";
import { getType, isExactFileOrAncestor } from "../file-and-folders";
import { formatPathForUserSystem } from "../file-system/file-sys-util";

/**
 * Simple date formatting function for performance matters.
 * @param timestamp
 */
const formatOutputDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = `0${date.getUTCDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const getId = property<{ id: string }, "id">("id");

const getFilePath = compose(formatPathForUserSystem, getId);

const getPathLength = compose((path: string) => `${path.length}`, getFilePath);

const getName = property<{ name: string }, "name">("name");

const getExtension = compose(extname, getName);

const getChildrenTotalSize = compose(
  toString,
  property<{ childrenTotalSize: number }, "childrenTotalSize">(
    "childrenTotalSize"
  )
);

const getFirstModifiedDate = compose(
  formatOutputDate,
  property<{ initialMinLastModified: number }, "initialMinLastModified">(
    "initialMinLastModified"
  )
);

const getLastModifiedDate = compose(
  formatOutputDate,
  property<{ initialMaxLastModified: number }, "initialMaxLastModified">(
    "initialMaxLastModified"
  )
);

const getNewLastModifiedDateForFolder = ({
  initialMaxLastModified,
  maxLastModified,
}: AccessorParams) =>
  initialMaxLastModified === maxLastModified
    ? ""
    : formatOutputDate(maxLastModified);

const getNewFirstModifiedDateForFolder = ({
  initialMinLastModified,
  minLastModified,
}: AccessorParams) =>
  initialMinLastModified === minLastModified
    ? ""
    : formatOutputDate(minLastModified);

const getNewPath = ({ virtualPath, id }: { id: string; virtualPath: string }) =>
  virtualPath !== id ? formatPathForUserSystem(virtualPath) : "";

const getAlias = ({ aliases, id }: { aliases: AliasMap; id: keyof AliasMap }) =>
  aliases[id] || "";

const getComments = ({
  comments,
  id,
}: {
  comments: CommentsMap;
  id: keyof CommentsMap;
}) => comments[id] || "";

const getFileOrFolderText = ({
  file,
  folder,
}: {
  file: string;
  folder: string;
}) => compose((isAFile) => (isAFile ? file : folder), isFile);

const getDepth = compose(toString, getDepthFromPath, getId);

const getFileCount = compose(
  toString,
  property<{ nbChildrenFiles: number }, "nbChildrenFiles">("nbChildrenFiles")
);

const getFileHash = ({ id, hashes }: { hashes: HashesMap; id: string }) =>
  hashes[id] ?? "";

const getHasDuplicateText =
  ({ yes, no }: { no: string; yes: string }) =>
  ({
    hashes,
    duplicatesMap,
    ...currentFf
  }: FilesAndFolders & {
    duplicatesMap: DuplicatesMap;
  } & { hashes: HashesMap }) =>
    hasDuplicateInDuplicatesMap(duplicatesMap, hashes[currentFf.id] ?? "")
      ? yes
      : no;

const getTypeText =
  ({
    folder: folderLabel,
    unknown: unknownLabel,
  }: {
    folder: string;
    unknown: string;
  }) =>
  (filesAndFolders: FilesAndFolders) =>
    getType(filesAndFolders, { folderLabel, unknownLabel });

const getToDeleteText = (toDeleteText: string) =>
  compose(
    (isToDelete: boolean) => (isToDelete ? toDeleteText : ""),
    ({ id, idsToDelete }: { id: string; idsToDelete: string[] }) =>
      idsToDelete.includes(id)
  );

const getTagText = ({ name, ffIds }: { ffIds: string[]; name: string }) =>
  compose(
    (isTaggged) => (isTaggged ? name : ""),
    ({ id }: { id: string }) =>
      ffIds.some((taggedId) => isExactFileOrAncestor(id, taggedId))
  );

type AccessorParams = FilesAndFolders &
  FilesAndFoldersMetadata & {
    comments: CommentsMap;
  } & {
    idsToDelete: string[];
  } & {
    metadata: MetadataByEntity;
  } & { aliases: AliasMap } & { hashes: HashesMap };

type Accessor = (params: AccessorParams) => string;
export interface CellConfig {
  accessor: Accessor;
  id: string;
  title: string;
}

const makeCellConfigCreator =
  (translate: TFunction) =>
  (id: string, accessor: Accessor): CellConfig => ({
    accessor,
    id,
    title: id ? translate(`csvHeader.${id}`) : "",
  });

const makeTagsConfig = compose(
  (tags) =>
    tags.map(
      ({ id, name, ffIds }: Tag, index): CellConfig => ({
        accessor: getTagText({ ffIds, name }),
        id,
        title: `tag${index} : ${name}`,
      })
    ),
  sortBy<Tag>("name")
);

const getMetadataName = (
  metadataName: string,
  sedaMapping: SedaMetadataMapping
) =>
  sedaMapping[metadataName]
    ? `${metadataName} (${sedaMapping[metadataName]})`
    : metadataName;

const makeMetdataConfig = ({
  metadataKeys,
  sedaMapping,
}: CsvExportData): CellConfig[] => {
  return metadataKeys.map(
    (metadataName): CellConfig => ({
      accessor: (params) =>
        params.metadata[params.id]?.find(({ name }) => name === metadataName)
          ?.content ?? "",
      id: metadataName,
      title: getMetadataName(metadataName, sedaMapping),
    })
  );
};

export const makeRowConfig = (
  translate: TFunction,
  config: CsvExportData
): CellConfig[] => {
  const createCellConfig = makeCellConfigCreator(translate);
  return [
    createCellConfig("", constant("")),
    createCellConfig("path", getFilePath),
    createCellConfig("pathLength", getPathLength),
    createCellConfig("name", getName),
    createCellConfig("extension", getExtension),
    createCellConfig("size", getChildrenTotalSize),
    createCellConfig("firstModified", getFirstModifiedDate),
    createCellConfig("lastModified", getLastModifiedDate),
    createCellConfig("newFirstModified", getNewFirstModifiedDateForFolder),
    createCellConfig("newLastModified", getNewLastModifiedDateForFolder),
    createCellConfig("newPath", getNewPath),
    createCellConfig("newName", getAlias),
    createCellConfig("description", getComments),
    createCellConfig(
      "fileOrFolder",
      getFileOrFolderText({
        file: translate("common.fileWord"),
        folder: translate("common.folder"),
      })
    ),
    createCellConfig("depth", getDepth),
    createCellConfig("fileCount", getFileCount),
    createCellConfig(
      "type",
      getTypeText({
        folder: translate("common.folder"),
        unknown: translate("common.unknown"),
      })
    ),
    createCellConfig("hash", getFileHash),
    createCellConfig(
      "duplicate",
      // @ts-expect-error for testing purpose
      getHasDuplicateText({
        no: translate("common.no"),
        yes: translate("common.yes"),
      })
    ),
    createCellConfig("toDelete", getToDeleteText(translate("common.toDelete"))),
    ...makeTagsConfig(config.tags),
    ...makeMetdataConfig(config),
  ];
};
