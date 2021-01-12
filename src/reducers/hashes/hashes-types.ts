import { ArchifiltreError } from "util/error/error-util";

export const SET_FILES_AND_FOLDERS_HASHES = "FILES_AND_FOLDERS/SET_HASHES";
export const RESET_ERRORED_HASHES = "HASHES/RESET_ERRORED_HASHES";
export const ADD_ERRORED_HASHES = "HASHES/ADD_ERRORED_HASHES";

export type HashesMap = {
  [id: string]: string | null;
};

export type HashesState = {
  hashes: HashesMap;
  erroredHashes: ArchifiltreError[];
};

type SetFilesAndFoldersHashesAction = {
  type: typeof SET_FILES_AND_FOLDERS_HASHES;
  hashes: HashesMap;
};

type ResetErroredHashesAction = {
  type: typeof RESET_ERRORED_HASHES;
};

type AddErroredHashesAction = {
  hashErrors: ArchifiltreError[];
  type: typeof ADD_ERRORED_HASHES;
};

export type HashesActionTypes =
  | SetFilesAndFoldersHashesAction
  | ResetErroredHashesAction
  | AddErroredHashesAction;
