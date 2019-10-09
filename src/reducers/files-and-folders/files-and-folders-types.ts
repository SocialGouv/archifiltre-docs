import { Action } from "redux";

export const INITIALIZE_FILES_AND_FOLDERS = "FILES_AND_FOLDERS/INITIALIZE";

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

export type FilesAndFoldersActionTypes = InitializeFilesAndFoldersAction;
