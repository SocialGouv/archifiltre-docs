import {
  ADD_TAG,
  DELETE_TAG,
  INITIALIZE_TAGS,
  RENAME_TAG,
  TAG_FILE,
  TagMap,
  TagsActionTypes,
  UNTAG_FILE
} from "./tags-types";

export const initializeTags = (tags: TagMap): TagsActionTypes => ({
  tags,
  type: INITIALIZE_TAGS
});

export const addTag = (
  tagName: string,
  ffId: string,
  tagId = ""
): TagsActionTypes => ({
  ffId,
  tagId,
  tagName,
  type: ADD_TAG
});

export const renameTag = (tagId: string, tagName: string): TagsActionTypes => ({
  tagId,
  tagName,
  type: RENAME_TAG
});

export const deleteTag = (tagId: string): TagsActionTypes => ({
  tagId,
  type: DELETE_TAG
});

export const tagFile = (tagId: string, ffId: string): TagsActionTypes => ({
  ffId,
  tagId,
  type: TAG_FILE
});

export const untagFile = (tagId: string, ffId: string): TagsActionTypes => ({
  ffId,
  tagId,
  type: UNTAG_FILE
});
