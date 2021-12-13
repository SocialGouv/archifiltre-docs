import type { ArchifiltreError } from "../../util/error/error-util";

export const SET_FILES_AND_FOLDERS_HASHES = "FILES_AND_FOLDERS/SET_HASHES";
export const RESET_ERRORED_HASHES = "HASHES/RESET_ERRORED_HASHES";
export const ADD_ERRORED_HASHES = "HASHES/ADD_ERRORED_HASHES";

export type HashesMap = Record<string, string | null>;

export interface HashesState {
  hashes: HashesMap;
  erroredHashes: ArchifiltreError[];
}

interface SetFilesAndFoldersHashesAction {
  type: typeof SET_FILES_AND_FOLDERS_HASHES;
  hashes: HashesMap;
}

interface ResetErroredHashesAction {
  type: typeof RESET_ERRORED_HASHES;
}

interface AddErroredHashesAction {
  hashErrors: ArchifiltreError[];
  type: typeof ADD_ERRORED_HASHES;
}

export type HashesActionTypes =
  | AddErroredHashesAction
  | ResetErroredHashesAction
  | SetFilesAndFoldersHashesAction;
