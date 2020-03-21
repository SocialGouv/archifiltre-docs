import {
  ADD_TAG,
  DELETE_TAG,
  INITIALIZE_TAGS,
  RENAME_TAG,
  RESET_TAGS,
  TAG_FILE,
  TagMap,
  TagsActionTypes,
  UNTAG_FILE,
} from "./tags-types";

/**
 * Action to reset tags
 */
export const resetTags = (): TagsActionTypes => ({
  type: RESET_TAGS,
});

/**
 * Action to set the initial state of the tags store
 * @param tags - The tags to set
 */
export const initializeTags = (tags: TagMap): TagsActionTypes => ({
  tags,
  type: INITIALIZE_TAGS,
});

/**
 * Action to add a tag to the store
 * @param tagName - The tag name
 * @param ffId - The id of the file to tag
 * @param [tagId] - Used to force the tag id. Will be obsolete when real-estate tags will be removed.
 */
export const addTag = (
  tagName: string,
  ffId: string,
  tagId = ""
): TagsActionTypes => ({
  ffId,
  tagId,
  tagName,
  type: ADD_TAG,
});

/**
 * Action to rename a tag
 * @param tagId - The tag Id
 * @param tagName - The new tag name
 */
export const renameTag = (tagId: string, tagName: string): TagsActionTypes => ({
  tagId,
  tagName,
  type: RENAME_TAG,
});

/**
 * Action to delete a tag from  the store
 * @param tagId - The tag id to remove
 */
export const deleteTag = (tagId: string): TagsActionTypes => ({
  tagId,
  type: DELETE_TAG,
});

/**
 * Action to tag a file.
 * @param tagId - The id of the tag to add to the file
 * @param ffId - The id of the file to tag
 */
export const tagFile = (tagId: string, ffId: string): TagsActionTypes => ({
  ffId,
  tagId,
  type: TAG_FILE,
});

/**
 * Action to remove a tag from a file
 * @param tagId - The id of the tag to remove from the file
 * @param ffId - The id of the file to untag
 */
export const untagFile = (tagId: string, ffId: string): TagsActionTypes => ({
  ffId,
  tagId,
  type: UNTAG_FILE,
});
