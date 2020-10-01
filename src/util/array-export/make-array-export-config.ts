import { compose, constant, property, sortBy, toString } from "lodash/fp";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";
import { extname } from "path";
import {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import {
  getDepthFromPath,
  isFile,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { HashesMap } from "reducers/hashes/hashes-types";
import { hasDuplicate } from "util/duplicates/duplicates-util";
import {
  getType,
  isExactFileOrAncestor,
} from "util/files-and-folders/file-and-folders-utils";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { TFunction } from "i18next";
import { Tag, TagMap } from "reducers/tags/tags-types";

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
  property<{ minLastModified: number }, "minLastModified">("minLastModified")
);

const getLastModifiedDate = compose(
  formatOutputDate,
  property<{ maxLastModified: number }, "maxLastModified">("maxLastModified")
);

const getNewPath = ({ virtualPath, id }: { virtualPath: string; id: string }) =>
  virtualPath !== id ? formatPathForUserSystem(virtualPath) : "";

const getAlias = ({ aliases, id }: { aliases: AliasMap; id }) =>
  aliases[id] || "";

const getComments = ({ comments, id }: { comments: CommentsMap; id: string }) =>
  comments[id] || "";

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

const getFileHash = ({ id, hashes }: { id: string; hashes: HashesMap }) =>
  hashes[id] || "";

const getHasDuplicateText = ({ yes, no }: { yes: string; no: string }) => ({
  hashes,
  ...currentFf
}: { hashes: HashesMap } & FilesAndFolders) =>
  hasDuplicate(hashes, currentFf) ? yes : no;

const getTypeText = ({
  folder: folderLabel,
  unknown: unknownLabel,
}: {
  folder: string;
  unknown: string;
}) => (filesAndFolders: FilesAndFolders) =>
  getType(filesAndFolders, { folderLabel, unknownLabel });

const getToDeleteText = (toDeleteText: string) =>
  compose(
    (isToDelete: boolean) => (isToDelete ? toDeleteText : ""),
    ({ id, idsToDelete }: { id: string; idsToDelete: string[] }) =>
      idsToDelete.includes(id)
  );

const getTagText = ({ name, ffIds }: { name: string; ffIds: string[] }) =>
  compose(
    (isTaggged) => (isTaggged ? name : ""),
    ({ id }: { id: string }) =>
      ffIds.some((taggedId) => isExactFileOrAncestor(id, taggedId))
  );

type AccessorParams = FilesAndFolders &
  FilesAndFoldersMetadata & { hashes: HashesMap } & { aliases: AliasMap } & {
    comments: CommentsMap;
  } & {
    idsToDelete: string[];
  };

type Accessor = (params: AccessorParams) => string;
export type CellConfig = {
  id: string;
  title: string;
  accessor: Accessor;
};

const makeCellConfigCreator = (translate: TFunction) => (
  id: string,
  accessor: Accessor
): CellConfig => ({
  id,
  title: id ? translate(`csvHeader.${id}`) : "",
  accessor,
});

const makeTagsConfig = compose(
  (tags) =>
    tags.map(
      ({ id, name, ffIds }: Tag, index): CellConfig => ({
        id,
        title: `tag${index} : ${name}`,
        accessor: getTagText({ name, ffIds }),
      })
    ),
  sortBy<Tag>("name")
);

export const makeRowConfig = (
  translate: TFunction,
  tags: TagMap
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
    createCellConfig("newPath", getNewPath),
    createCellConfig("newName", getAlias),
    createCellConfig("description", getComments),
    createCellConfig(
      "fileOrFolder",
      getFileOrFolderText({
        file: translate("common.file"),
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
      getHasDuplicateText({
        yes: translate("common.yes"),
        no: translate("common.no"),
      })
    ),
    createCellConfig("toDelete", getToDeleteText(translate("common.toDelete"))),
    ...makeTagsConfig(tags),
  ];
};
