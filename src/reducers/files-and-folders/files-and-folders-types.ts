import { Action } from "redux";
import { SetFilesAndFoldersHashesAction } from "../hashes/hashes-types";

export const INITIALIZE_FILES_AND_FOLDERS = "FILES_AND_FOLDERS/INITIALIZE";
export const REMOVE_CHILD = "FILES_AND_FOLDERS/REMOVE_CHILD";
export const ADD_CHILD = "FILES_AND_FOLDERS/ADD_CHILD";
export const SET_FILES_AND_FOLDERS_ALIAS = "FILES_AND_FOLDERS/SET_ALIAS";
export const ADD_COMMENTS_ON_FILES_AND_FOLDERS =
  "FILES_AND_FOLDERS/ADD_COMMENTS";
export const MARK_AS_TO_DELETE = "FILES_AND_FOLDERS/MARK_AS_TO_DELETE";
export const UNMARK_AS_TO_DELETE = "FILES_AND_FOLDERS/UNMARK_AS_TO_DELETE";
export const MARK_ELEMENTS_TO_DELETE =
  "FILES_AND_FOLDERS/MARK_ELEMENTS_TO_DELETE";
export const INIT_VIRTUAL_PATH_TO_ID_MAP =
  "FILES_AND_FOLDERS/INIT_VIRTUAL_PATH_TO_ID_MAP";

export interface FilesAndFolders {
  id: string;
  name: string;
  children: string[];
  file_size: number;
  file_last_modified: number;
  virtualPath: string;
}

export interface FilesAndFoldersMap {
  [id: string]: FilesAndFolders;
}

export interface CommentsMap {
  [id: string]: string;
}

export interface AliasMap {
  [id: string]: string;
}

export interface VirtualPathToIdMap {
  [id: string]: string;
}

export interface FilesAndFoldersState {
  filesAndFolders: FilesAndFoldersMap;
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  virtualPathToId: VirtualPathToIdMap;
}

interface InitializeFilesAndFoldersAction extends Action {
  type: typeof INITIALIZE_FILES_AND_FOLDERS;
  filesAndFolders: FilesAndFoldersMap;
}

interface RemoveChildAction extends Action {
  type: typeof REMOVE_CHILD;
  childId: string;
  parentId: string;
}

interface AddChildAction extends Action {
  type: typeof ADD_CHILD;
  childId: string;
  parentId: string;
}

interface SetFilesAndFoldersAliasAction extends Action {
  type: typeof SET_FILES_AND_FOLDERS_ALIAS;
  aliases: AliasMap;
}

interface AddCommentsOnFilesAndFoldersAction extends Action {
  type: typeof ADD_COMMENTS_ON_FILES_AND_FOLDERS;
  comments: CommentsMap;
}

interface MarkAsToDelete extends Action {
  type: typeof MARK_AS_TO_DELETE;
  filesAndFoldersId: string;
}

interface UnmarkAsToDelete extends Action {
  type: typeof UNMARK_AS_TO_DELETE;
  filesAndFoldersId: string;
}

interface MarkElementsToDelete extends Action {
  type: typeof MARK_ELEMENTS_TO_DELETE;
  elementIds: string[];
}

interface InitVirtualPathToIdMap extends Action {
  type: typeof INIT_VIRTUAL_PATH_TO_ID_MAP;
  virtualPathToIdMap: VirtualPathToIdMap;
}

export type FilesAndFoldersActionTypes =
  | InitializeFilesAndFoldersAction
  | AddChildAction
  | RemoveChildAction
  | SetFilesAndFoldersAliasAction
  | AddCommentsOnFilesAndFoldersAction
  | SetFilesAndFoldersHashesAction
  | MarkAsToDelete
  | UnmarkAsToDelete
  | MarkElementsToDelete
  | InitVirtualPathToIdMap;
