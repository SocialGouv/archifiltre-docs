import _ from "lodash";
import { Tag, TagMap } from "./tags-types";

/**
 * Returns all the tags that are associated to the provided ffId
 * @param tagMap - The TagMap as in the redux store
 * @param ffId - The ffid
 * @returns The list of tagIds for the file
 */
export const getAllTagIdsForFile = (tagMap: TagMap, ffId: string): string[] =>
  Object.keys(tagMap).filter(key => tagMap[key].ffIds.has(ffId));

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
  _.find(Object.values(tagMap), tag => tag.name === name);

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

/**
 * Sort tags
 * @param tagList - The tag list to sort
 * @param options - The sort options
 * @param {Order} [options.order=Order.ASC]  - The sort order. Defaults to Ascending.
 * @param {string} [options.sortParam="name"] - The param to sort on. Defaults to name.
 */
export const sortTags = (tagList: Tag[], options: SortTagOptions): Tag[] => {
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
 * @param ffs - The files and folders structure
 * @returns the total size of the tagged files and folders
 */
export const getTagSize = (tag: Tag, ffs: any): number => {
  const arrayFfIds = [...tag.ffIds];
  const taggedFf = ffs.filter((ff, path) =>
    _.some(
      arrayFfIds,
      ffId =>
        path.indexOf(ffId) === 0 && (path[ffId.length] === "/" || path === ffId)
    )
  );
  return taggedFf.reduce((totalSize, ff) => totalSize + ff.get("file_size"), 0);
};
