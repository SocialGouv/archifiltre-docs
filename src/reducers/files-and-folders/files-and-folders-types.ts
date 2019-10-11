import { Action } from "redux";

export const INITIALIZE_FILES_AND_FOLDERS = "FILES_AND_FOLDERS/INITIALIZE";
export const SET_FILES_AND_FOLDERS_ALIAS = "FILES_AND_FOLDERS/SET_ALIAS";
export const SET_FILES_AND_FOLDERS_HASH = "FILES_AND_FOLDERS/SET_HASH";
export const ADD_COMMENTS_ON_FILES_AND_FOLDERS =
  "FILES_AND_FOLDERS/ADD_COMMENTS";

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

export interface FilesAndFoldersState {
  filesAndFolders: FilesAndFoldersMap;
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

interface SetFilesAndFoldersHashAction extends Action {
  type: typeof SET_FILES_AND_FOLDERS_HASH;
  filesAndFoldersId: string;
  hash: string;
}

interface AddCommentsOnFilesAndFoldersAction extends Action {
  type: typeof ADD_COMMENTS_ON_FILES_AND_FOLDERS;
  filesAndFoldersId: string;
  comments: string;
}

export type FilesAndFoldersActionTypes =
  | InitializeFilesAndFoldersAction
  | SetFilesAndFoldersAliasAction
  | AddCommentsOnFilesAndFoldersAction
  | SetFilesAndFoldersHashAction;
