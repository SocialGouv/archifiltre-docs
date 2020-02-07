import { Action } from "redux";

export const INITIALIZE_FILES_AND_FOLDERS = "FILES_AND_FOLDERS/INITIALIZE";
export const SET_FILES_AND_FOLDERS_ALIAS = "FILES_AND_FOLDERS/SET_ALIAS";
export const SET_FILES_AND_FOLDERS_HASHES = "FILES_AND_FOLDERS/SET_HASHES";
export const ADD_COMMENTS_ON_FILES_AND_FOLDERS =
  "FILES_AND_FOLDERS/ADD_COMMENTS";
export const MARK_AS_TO_DELETE = "FILES_AND_FOLDERS/MARK_AS_TO_DELETE";
export const UNMARK_AS_TO_DELETE = "FILES_AND_FOLDERS/UNMARK_AS_TO_DELETE";

export interface FilesAndFolders {
  id: string;
  name: string;
  alias: string;
  comments: string;
  children: string[];
  file_size: number;
  file_last_modified: number;
  hash: string | null;
}

export interface FilesAndFoldersMap {
  [id: string]: FilesAndFolders;
}

export interface HashesMap {
  [id: string]: string;
}

export interface FilesAndFoldersState {
  filesAndFolders: FilesAndFoldersMap;
  hashes: HashesMap;
  elementsToDelete: string[];
}

interface InitializeFilesAndFoldersAction extends Action {
  type: typeof INITIALIZE_FILES_AND_FOLDERS;
  filesAndFolders: FilesAndFoldersMap;
}

interface SetFilesAndFoldersAliasAction extends Action {
  type: typeof SET_FILES_AND_FOLDERS_ALIAS;
  filesAndFoldersId: string;
  alias: string;
}

interface SetFilesAndFoldersHashesAction extends Action {
  type: typeof SET_FILES_AND_FOLDERS_HASHES;
  hashes: HashesMap;
}

interface AddCommentsOnFilesAndFoldersAction extends Action {
  type: typeof ADD_COMMENTS_ON_FILES_AND_FOLDERS;
  filesAndFoldersId: string;
  comments: string;
}

interface MarkAsToDelete extends Action {
  type: typeof MARK_AS_TO_DELETE;
  filesAndFoldersId: string;
}

interface UnmarkAsToDelete extends Action {
  type: typeof UNMARK_AS_TO_DELETE;
  filesAndFoldersId: string;
}

export type FilesAndFoldersActionTypes =
  | InitializeFilesAndFoldersAction
  | SetFilesAndFoldersAliasAction
  | AddCommentsOnFilesAndFoldersAction
  | SetFilesAndFoldersHashesAction
  | MarkAsToDelete
  | UnmarkAsToDelete;
