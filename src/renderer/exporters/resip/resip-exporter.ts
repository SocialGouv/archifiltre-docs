import { makeEmptyArray, replaceValue } from "@common/utils/array";
import dateFormat from "dateformat";
import _, { noop } from "lodash";
import path from "path";

import {
  type AliasMap,
  type CommentsMap,
  type FilesAndFolders,
  type FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { type FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getArchivalAgencyArchiveUnitIdentifierFromMetadata } from "../../reducers/metadata/metadata-selector";
import { type Metadata } from "../../reducers/metadata/metadata-types";
import { isTagMetadata } from "../../reducers/seda-configuration/seda-configuration-selector";
import { createTag, tagHasFfId } from "../../reducers/tags/tags-selectors";
import { type Tag, type TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import { getDisplayName, isExactFileOrAncestor } from "../../utils/file-and-folders";

interface TagWithID extends Tag {
  ID: number;
}

interface FilesAndFoldersWithID extends FilesAndFolders {
  ID: number;

  ParentID?: number;
  tags: TagWithID[];
}

const nameChangedText = (oldName: string) => translations.t("common.originalName", { oldName });

const formatFile = (ff: FilesAndFolders) => {
  const resipFilePath = (ff.id.startsWith("/") ? ff.id.substring(1) : ff.id).split("/").slice(1).join("/");

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
const formatTitle = (ff: FilesAndFolders, aliases: AliasMap, sedaMetadata: SedaMetadataMap) =>
  getDisplayName(path.basename(ff.id), aliases[ff.id], sedaMetadata[ff.id]);

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
  fileAndFolders: FilesAndFoldersWithID[],
) => {
  const parent = fileAndFolders.find(({ children }) => children.includes(fileOrFolder.id));

  return {
    ...fileOrFolder,

    ParentID: parent?.ID,
  };
};

const formatCustodialHistory = (
  fileAndFolder: FilesAndFolders,
  aliases: AliasMap,
  sedaMetadataMap: SedaMetadataMap,
) => {
  const base = aliases[fileAndFolder.id] ? nameChangedText(fileAndFolder.name) : "";

  const sedaMetadata = sedaMetadataMap[fileAndFolder.id] ?? [];

  const custodialHistoryMetadata = sedaMetadata
    .filter(({ name }) => name === "CustodialHistory")
    .map(({ content }) => content);

  return [base, ...custodialHistoryMetadata].filter(val => val !== "").join(" | ");
};

interface ResipFormat {
  ArchivalAgencyArchiveUnitIdentifier?: string;
  "CustodialHistory.CustodialHistoryItem": string;
  Description: string;
  DescriptionLevel: string;
  EndDate: string;
  File: string;
  ID: number;
  ParentID?: number;
  StartDate: string;
  Tags: TagWithID[];
  Title: string;
  TransactedDate: string;
}

type SedaMetadataMap = Record<string, Metadata[]>;

/**
 * Mapper that transform enriched archifiltre data to Resip compatible data
 */
const transformDefaultFormatToResip =
  (
    aliases: AliasMap,
    comments: CommentsMap,
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
    sedaMetadata: SedaMetadataMap,
  ) =>
  (enrichedFilesAndFolders: FilesAndFoldersWithID): ResipFormat => ({
    ArchivalAgencyArchiveUnitIdentifier: getArchivalAgencyArchiveUnitIdentifierFromMetadata(
      sedaMetadata[enrichedFilesAndFolders.id],
    ),
    "CustodialHistory.CustodialHistoryItem": formatCustodialHistory(enrichedFilesAndFolders, aliases, sedaMetadata),
    Description: comments[enrichedFilesAndFolders.id] || "",
    DescriptionLevel: formatDescriptionLevel(enrichedFilesAndFolders),
    EndDate: formatDate(filesAndFoldersMetadata[enrichedFilesAndFolders.id].maxLastModified),
    File: formatFile(enrichedFilesAndFolders),
    ID: enrichedFilesAndFolders.ID,
    ParentID: enrichedFilesAndFolders.ParentID,
    StartDate: formatDate(filesAndFoldersMetadata[enrichedFilesAndFolders.id].minLastModified),
    Tags: enrichedFilesAndFolders.tags,
    Title: formatTitle(enrichedFilesAndFolders, aliases, sedaMetadata),
    TransactedDate: formatDate(Date.now()),
  });

/**
 * Returns all tags for the provided fileAndFolder id
 */
const getAllTagsByFfId = (tags: Tag[], ffId: string) =>
  tags.reduce<Tag[]>((tagList, tag) => (tagHasFfId(tag, ffId) ? [...tagList, tag] : tagList), []);

const addTagsToFf = (tags: Tag[]) => (ff: FilesAndFoldersWithID) => ({
  ...ff,
  tags: getAllTagsByFfId(tags, ff.id),
});

const formatToCsv = (sipFilesAndFolders: ResipFormat[], tags: Tag[]) => {
  const fieldsOrder: Array<keyof ResipFormat> = [
    "ID",
    "ParentID",
    "File",
    "DescriptionLevel",
    "Title",
    "ArchivalAgencyArchiveUnitIdentifier",
    "StartDate",
    "EndDate",
    "TransactedDate",
    "CustodialHistory.CustodialHistoryItem",
    "Description",
  ];
  const tagsFields = tags.map((_tag, index) => `Content.Tag.${index}`);

  const firstRow: string[] = (fieldsOrder as string[]).concat(tagsFields);

  const dataRows = sipFilesAndFolders.map(sipFileAndFolder => {
    const baseFileAndFolder = fieldsOrder.map(field => `${sipFileAndFolder[field] ?? ""}`);
    const tagsCells = sipFileAndFolder.Tags.reduce(
      (acc, { ID, name }) => replaceValue(acc, ID, name),
      makeEmptyArray(tags.length, ""),
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

    return mapper(mappedElement, mappedIndex, mappedArray);
  };

export interface ResipExporterOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  sedaMetadata: Record<string, Metadata[]>;
  tags: TagMap;
}

/**
 * Check if an ancestor of the fileAndFolders is marked as deleted
 * @param ffId
 * @param elementsToDelete
 */
const isAncestorDeleted = (ffId: string, elementsToDelete: string[]): boolean =>
  _.some(elementsToDelete, toDeleteId => isExactFileOrAncestor(ffId, toDeleteId));

export const RESIP_HOOK_CALL_PER_ELEMENT = 4;

const extractTagsFromSedaMetadata = (sedaMetadata: SedaMetadataMap): Tag[] => {
  const tags: Record<string, Tag> = {};

  Object.entries(sedaMetadata).forEach(([ffId, metadatas]) => {
    metadatas.filter(isTagMetadata).forEach(metadata => {
      if (!tags[metadata.content]) {
        tags[metadata.content] = createTag({
          id: metadata.content,
          name: metadata.content,
        });
      }

      tags[metadata.content].ffIds.push(ffId);
    });
  });

  return Object.values(tags);
};

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
    sedaMetadata,
    tags,
  }: ResipExporterOptions,
  hook = noop,
): unknown[][] => {
  let sipId = 0;

  const addSipId = (ff: FilesAndFolders) => {
    sipId = sipId + 1;
    return { ...ff, ID: `${sipId}` };
  };

  const allTags = Object.values(tags).concat(extractTagsFromSedaMetadata(sedaMetadata));

  const tagsWithIndex = Object.values(allTags)
    .filter(({ ffIds }) => ffIds.length !== 0)
    .map((tag, tagIndex) => ({
      ...tag,
      ID: tagIndex,
    }));

  const dataWithSipId = Object.keys(filesAndFolders)
    .filter(id => !isAncestorDeleted(id, elementsToDelete))
    .filter(id => id)
    .map(
      wrapWithHook(
        (ffId: string) => ({
          ...filesAndFolders[ffId],
          ...filesAndFoldersMetadata[ffId],
        }),
        hook,
      ),
    )
    .map(wrapWithHook(addSipId, hook))
    .map(wrapWithHook(addParentId, hook))
    .map(wrapWithHook(addTagsToFf(tagsWithIndex), hook)) as FilesAndFoldersWithID[];

  const formattedData = dataWithSipId.map(
    transformDefaultFormatToResip(aliases, comments, filesAndFoldersMetadata, sedaMetadata),
  );

  return formatToCsv(formattedData, tagsWithIndex);
};
