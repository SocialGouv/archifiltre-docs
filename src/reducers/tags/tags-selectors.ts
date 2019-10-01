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
