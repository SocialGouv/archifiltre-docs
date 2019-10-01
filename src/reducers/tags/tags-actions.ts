import {
  ADD_TAG,
  DELETE_TAG,
  RENAME_TAG,
  TAG_FILE,
  TagsActionTypes,
  UNTAG_FILE
} from "./tags-types";

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
