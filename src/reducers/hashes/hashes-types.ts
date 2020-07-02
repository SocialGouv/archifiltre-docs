import { Action } from "redux";

export const SET_FILES_AND_FOLDERS_HASHES = "FILES_AND_FOLDERS/SET_HASHES";

export type HashesMap = {
  [id: string]: string | null;
};

export type HashesState = {
  hashes: HashesMap;
};

export interface SetFilesAndFoldersHashesAction extends Action {
  type: typeof SET_FILES_AND_FOLDERS_HASHES;
  hashes: HashesMap;
}

export type HashesActionTypes = SetFilesAndFoldersHashesAction;
