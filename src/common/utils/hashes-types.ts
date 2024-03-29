import type { ArchifiltreDocsError } from "./error";

export const SET_FILES_AND_FOLDERS_HASHES = "FILES_AND_FOLDERS/SET_HASHES";
export const RESET_ERRORED_HASHES = "HASHES/RESET_ERRORED_HASHES";
export const ADD_ERRORED_HASHES = "HASHES/ADD_ERRORED_HASHES";

export type HashesMap = Record<string, string | null>;

export interface HashesState {
  erroredHashes: ArchifiltreDocsError[];
  hashes: HashesMap;
}

interface SetFilesAndFoldersHashesAction {
  hashes: HashesMap;
  type: typeof SET_FILES_AND_FOLDERS_HASHES;
}

interface ResetErroredHashesAction {
  type: typeof RESET_ERRORED_HASHES;
}

interface AddErroredHashesAction {
  hashErrors: ArchifiltreDocsError[];
  type: typeof ADD_ERRORED_HASHES;
}

export type HashesActionTypes =
  | AddErroredHashesAction
  | ResetErroredHashesAction
  | SetFilesAndFoldersHashesAction;
