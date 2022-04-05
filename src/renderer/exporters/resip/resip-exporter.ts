import { makeEmptyArray, replaceValue } from "@common/utils/array";
import dateFormat from "dateformat";
import _, { noop } from "lodash";
import path from "path";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { tagHasFfId } from "../../reducers/tags/tags-selectors";
import type { Tag, TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import {
  getDisplayName,
  isExactFileOrAncestor,
} from "../../utils/file-and-folders";

interface TagWithID extends Tag {
  ID: number;
}

interface FilesAndFoldersWithID extends FilesAndFolders {
  ID: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ParentID?: number;
  tags: TagWithID[];
}

const nameChangedText = (oldName: string) =>
  translations.t("common.originalName", { oldName });

const formatFile = (ff: FilesAndFolders) => {
  const resipFilePath = (ff.id.startsWith("/") ? ff.id.substring(1) : ff.id)
    .split("/")
    .slice(1)
    .join("/");

  // We format the file path for the current file system
  return path.join(resipFilePath);
};

/**
 * Returns the SEDA description level corresponding to the FF item
 */
const formatDescriptionLevel = (ff: FilesAndFolders) => {
  if (ff.children.length === 0) {
    return "Item";
  }

  return "RecordGrp";
};

/**
 * Gets the title of a file or folder
 */
const formatTitle = (ff: FilesAndFolders, aliases: AliasMap) =>
  getDisplayName(path.basename(ff.id), aliases[ff.id]);

/**
 * Formats the date to "yyyy-mm-dd"
 */
const formatDate = (date: number) => dateFormat(date, "yyyy-mm-dd");

/**
 * Mapper to enrich fileOrFolder with parentId.
 * @param fileOrFolder
 * @param index
 * @param fileAndFolders
 * @returns {{ParentID: *}} - fileOrFolder with ParentID
 */
const addParentId = (
  fileOrFolder: FilesAndFolders,
  _index: number | string,
  fileAndFolders: FilesAndFoldersWithID[]
) => {
  const parent = fileAndFolders.find(({ children }) =>
    children.includes(fileOrFolder.id)
  );

  return {
    ...fileOrFolder,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ParentID: parent?.ID,
  };
};

const formatCustodialHistory = (
  fileAndFolder: FilesAndFolders,
  aliases: AliasMap
) => (aliases[fileAndFolder.id] ? nameChangedText(fileAndFolder.name) : "");

interface ResipFormat {
  /* eslint-disable @typescript-eslint/naming-convention */
  "CustodialHistory.CustodialHistoryItem": string;
  Description: string;
  DescriptionLevel: "Item" | "RecordGrp";
  EndDate: string;
  File: string;
  ID: number;
  ParentID?: number;
  StartDate: string;
  Tags: TagWithID[];
  Title: string;
  TransactedDate: string;
  /* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * Mapper that transform enriched archifiltre data to Resip compatible data
 */
const transformDefaultFormatToResip =
  (
    aliases: AliasMap,
    comments: CommentsMap,
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap
  ) =>
  (enrichedFilesAndFolders: FilesAndFoldersWithID): ResipFormat => ({
    /* eslint-disable @typescript-eslint/naming-convention */
    "CustodialHistory.CustodialHistoryItem": formatCustodialHistory(
      enrichedFilesAndFolders,
      aliases
    ),
    Description: comments[enrichedFilesAndFolders.id] || "",
    DescriptionLevel: formatDescriptionLevel(enrichedFilesAndFolders),
    EndDate: formatDate(
      filesAndFoldersMetadata[enrichedFilesAndFolders.id].maxLastModified
    ),
    File: formatFile(enrichedFilesAndFolders),
    ID: enrichedFilesAndFolders.ID,
    ParentID: enrichedFilesAndFolders.ParentID,
    StartDate: formatDate(
      filesAndFoldersMetadata[enrichedFilesAndFolders.id].minLastModified
    ),
    Tags: enrichedFilesAndFolders.tags,
    Title: formatTitle(enrichedFilesAndFolders, aliases),
    TransactedDate: formatDate(Date.now()),
    /* eslint-enable @typescript-eslint/naming-convention */
  });

/**
 * Returns all tags for the provided fileAndFolder id
 */
const getAllTagsByFfId = (tags: Tag[], ffId: string) =>
  tags.reduce<Tag[]>(
    (tagList, tag) => (tagHasFfId(tag, ffId) ? [...tagList, tag] : tagList),
    []
  );

const addTagsToFf = (tags: Tag[]) => (ff: FilesAndFoldersWithID) => ({
  ...ff,
  tags: getAllTagsByFfId(tags, ff.id),
});

const formatToCsv = (sipFilesAndFolders: ResipFormat[], tags: Tag[]) => {
  const fieldsOrder = [
    "ID",
    "ParentID",
    "File",
    "DescriptionLevel",
    "Title",
    "StartDate",
    "EndDate",
    "TransactedDate",
    "CustodialHistory.CustodialHistoryItem",
    "Description",
  ] as (keyof ResipFormat)[];
  const tagsFields = tags.map(
    (_tag, index) => `Content.Tag.${index}`
  ) as (keyof ResipFormat)[];

  const firstRow: unknown[] = fieldsOrder.concat(tagsFields);

  const dataRows = sipFilesAndFolders.map((sipFileAndFolder) => {
    const baseFileAndFolder = fieldsOrder.map(
      (field) => sipFileAndFolder[field] ?? ""
    );
    const tagsCells = sipFileAndFolder.Tags.reduce(
      (acc, { ID, name }) => replaceValue(acc, ID, name),
      makeEmptyArray(tags.length, "")
    );

    return [...baseFileAndFolder, ...tagsCells];
  });

  return [firstRow].concat(dataRows);
};

/**
 * Wraps a mapper with a side effect function called before the hook
 * @param mapper - the wrapped mapper that will still be called.
 * @param sideEffect - the side effect called with the mapper parameters
 * @returns {function} - The mapper that will call the hook every time the mapper called.
 */
const wrapWithHook =
  <T>(mapper = noop, sideEffect = noop): Parameters<T[]["map"]>[0] =>
  (mappedElement, mappedIndex, mappedArray) => {
    sideEffect(mappedElement, mappedIndex, mappedArray);
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return mapper(mappedElement, mappedIndex, mappedArray);
  };

interface ResipExporterOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  tags: TagMap;
}

/**
 * Check if an ancestor of the fileAndFolders is marked as deleted
 * @param ffId
 * @param elementsToDelete
 */
const isAncestorDeleted = (ffId: string, elementsToDelete: string[]): boolean =>
  _.some(elementsToDelete, (toDeleteId) =>
    isExactFileOrAncestor(ffId, toDeleteId)
  );

export const RESIP_HOOK_CALL_PER_ELEMENT = 4;

/**
 * Formats the fileStructure and tag into a csv that can be imported in RESIP
 */
export const resipExporter = (
  {
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    tags,
  }: ResipExporterOptions,
  hook = noop
): unknown[][] => {
  let sipId = 0;

  const addSipId = (ff: FilesAndFolders) => {
    sipId = sipId + 1;
    return { ...ff, ID: `${sipId}` };
  };

  const tagsWithIndex = Object.keys(tags)
    .map((tagId) => tags[tagId])
    .filter(({ ffIds }) => ffIds.length !== 0)
    .map((tag, tagIndex) => ({
      ...tag,
      ID: tagIndex,
    }));

  const dataWithSipId = Object.keys(filesAndFolders)
    .filter((id) => !isAncestorDeleted(id, elementsToDelete))
    .filter((id) => id)
    .map(
      wrapWithHook(
        (ffId: string) => ({
          ...filesAndFolders[ffId],
          ...filesAndFoldersMetadata[ffId],
        }),
        hook
      )
    )
    .map(wrapWithHook(addSipId, hook))
    .map(wrapWithHook(addParentId, hook))
    .map(
      wrapWithHook(addTagsToFf(tagsWithIndex), hook)
    ) as FilesAndFoldersWithID[];

  const formattedData = dataWithSipId.map(
    transformDefaultFormatToResip(aliases, comments, filesAndFoldersMetadata)
  );

  return formatToCsv(formattedData, tagsWithIndex);
};
