import type { Action } from "redux";

export const RESET_TAGS = "TAGS/RESET";
export const INITIALIZE_TAGS = "TAGS/INITIALIZE";
export const ADD_TAG = "TAGS/ADD_TAGS";
export const RENAME_TAG = "TAGS/RENAME_TAG";
export const DELETE_TAG = "TAGS/DELETE_TAG";
export const TAG_FILE = "TAGS/TAG_FILE";
export const UNTAG_FILE = "TAGS/UNTAG_FILE";

export interface Tag {
  ffIds: string[];
  id: string;
  name: string;
}

export type TagMap = Record<string, Tag>;

export interface TagsState {
  tags: TagMap;
}

interface ResetTagsAction extends Action {
  type: typeof RESET_TAGS;
}

interface InitializeTagsAction extends Action {
  tags: TagMap;
  type: typeof INITIALIZE_TAGS;
}

interface AddTagAction extends Action {
  ffId: string;
  tagId: string;
  tagName: string;
  type: typeof ADD_TAG;
}

interface RenameTagAction extends Action {
  tagId: string;
  tagName: string;
  type: typeof RENAME_TAG;
}

interface DeleteTagAction extends Action {
  tagId: string;
  type: typeof DELETE_TAG;
}

interface TagFileAction extends Action {
  ffId: string;
  tagId: string;
  type: typeof TAG_FILE;
}

interface UntagFileAction extends Action {
  ffId: string;
  tagId: string;
  type: typeof UNTAG_FILE;
}

export type TagsActionTypes =
  | AddTagAction
  | DeleteTagAction
  | InitializeTagsAction
  | RenameTagAction
  | ResetTagsAction
  | TagFileAction
  | UntagFileAction;
