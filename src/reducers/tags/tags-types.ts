import { Action } from "redux";

export const RESET_TAGS = "TAGS/RESET";
export const INITIALIZE_TAGS = "TAGS/INITIALIZE";
export const ADD_TAG = "TAGS/ADD_TAGS";
export const RENAME_TAG = "TAGS/RENAME_TAG";
export const DELETE_TAG = "TAGS/DELETE_TAG";
export const TAG_FILE = "TAGS/TAG_FILE";
export const UNTAG_FILE = "TAGS/UNTAG_FILE";

export interface Tag {
  id: string;
  name: string;
  ffIds: string[];
}

export interface TagMap {
  [tagId: string]: Tag;
}

export interface TagsState {
  tags: TagMap;
}

interface ResetTagsAction extends Action {
  type: typeof RESET_TAGS;
}

interface InitializeTagsAction extends Action {
  type: typeof INITIALIZE_TAGS;
  tags: TagMap;
}

interface AddTagAction extends Action {
  type: typeof ADD_TAG;
  tagName: string;
  tagId: string;
  ffId: string;
}

interface RenameTagAction extends Action {
  type: typeof RENAME_TAG;
  tagId: string;
  tagName: string;
}

interface DeleteTagAction extends Action {
  type: typeof DELETE_TAG;
  tagId: string;
}

interface TagFileAction extends Action {
  type: typeof TAG_FILE;
  tagId: string;
  ffId: string;
}

interface UntagFileAction extends Action {
  type: typeof UNTAG_FILE;
  tagId: string;
  ffId: string;
}

export type TagsActionTypes =
  | ResetTagsAction
  | InitializeTagsAction
  | AddTagAction
  | RenameTagAction
  | DeleteTagAction
  | TagFileAction
  | UntagFileAction;
