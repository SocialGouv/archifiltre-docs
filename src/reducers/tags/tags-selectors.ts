import _ from "lodash";
import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import { FilesAndFoldersMetadataMap } from "../files-and-folders-metadata/files-and-folders-metadata-types";
import { FilesAndFoldersMap } from "../files-and-folders/files-and-folders-types";
import { StoreState } from "../store";
import { Tag, TagMap } from "./tags-types";

/**
 * Returns all the tags ids that are associated to the provided ffId
 * @param tagMap - The TagMap as in the redux store
 * @param ffId - The ffid
 * @returns The list of tagIds for the file
 */
export const getAllTagIdsForFile = (tagMap: TagMap, ffId: string): string[] =>
  Object.keys(tagMap).filter(key => tagHasFfId(tagMap[key], ffId));

/**
 * Returns all the tags that are associated to the provided ffId
 * @param tagMap - The TagMap as in the redux store
 * @param ffId - The ffid
 * @returns The list of tags for the file
 */
export const getAllTagsForFile = (tagMap: TagMap, ffId: string): Tag[] =>
  tagMapToArray(tagMap).filter(tag => tagHasFfId(tag, ffId));

/**
 * Returns the tags corresponding to the ids in tagIds
 * @param tagMap - The TagMap as in the redux store
 * @param tagIds - the tags ids
 */
export const getTagsByIds = (tagMap: TagMap, tagIds: string[]): Tag[] =>
  tagIds.map(tagId => tagMap[tagId] || null).filter(tag => tag !== null);

/**
 * Checks if the tag name already exist
 * @param tagMap
 * @param name
 */
export const getTagByName = (tagMap: TagMap, name: string): Tag | undefined =>
  _.find(tagMapToArray(tagMap), tag => tag.name === name);

/**
 * Order for sorting functions
 */
export enum Order {
  ASC,
  DESC
}

export interface SortTagOptions {
  order?: Order;
  sortParam?: string;
}

const defaultSortTagOptions: SortTagOptions = {};

/**
 * Sort tags
 * @param tagList - The tag list to sort
 * @param options - The sort options
 * @param {Order} [options.order=Order.ASC]  - The sort order. Defaults to Ascending.
 * @param {string} [options.sortParam="name"] - The param to sort on. Defaults to name.
 */
export const sortTags = (
  tagList: Tag[],
  options = defaultSortTagOptions
): Tag[] => {
  const order = options.order || Order.ASC;
  const sortParam = options.sortParam || "name";

  const sortFunction = (tag1, tag2) => {
    if (tag1[sortParam] < tag2[sortParam]) {
      return order === Order.ASC ? -1 : 1;
    }
    if (tag1[sortParam] === tag2[sortParam]) {
      return 0;
    }
    return order === Order.ASC ? 1 : -1;
  };

  return tagList.sort(sortFunction);
};

/**
 * Computes a tag size based on the files and folders size
 * @param tag - The tag which you want to compute the value
 * @param filesAndFolders - The files and folders structure
 * @param filesAndFoldersMetadata - The files and folders metadata
 * @returns the total size of the tagged files and folders
 */
export const getTagSize = (
  tag: Tag,
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
): number => {
  const taggedFfIds = Object.keys(filesAndFolders).filter(id =>
    _.some(
      tag.ffIds,
      ffId => id.indexOf(ffId) === 0 && (id[ffId.length] === "/" || id === ffId)
    )
  );
  return taggedFfIds.reduce(
    (totalSize, id) =>
      totalSize + filesAndFoldersMetadata[id].childrenTotalSize,
    0
  );
};

/**
 * Returns true if a TagMap has tags, false otherwise.
 * @param tagMap
 */
export const tagMapHasTags = (tagMap: TagMap): boolean =>
  Object.keys(tagMap).length !== 0;

/**
 * Transforms a tagMap to a tag Array
 * @param tagMap
 */
export const tagMapToArray = (tagMap: TagMap): Tag[] => Object.values(tagMap);

/**
 *
 * @param tag
 * @param ffId
 */
export const tagHasFfId = (tag: Tag, ffId: string) => tag.ffIds.includes(ffId);

/**
 * Gets the tags map from the redux store.
 * @param store - The redux store
 */
export const getTagsFromStore = (store: StoreState): TagMap =>
  getCurrentState(store.tags).tags;
