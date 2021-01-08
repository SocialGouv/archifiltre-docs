import {
  ADD_ERRORED_HASHES,
  HashesActionTypes,
  HashesMap,
  RESET_ERRORED_HASHES,
  SET_FILES_AND_FOLDERS_HASHES,
} from "./hashes-types";
import { ArchifiltreError } from "util/error/error-util";

/**
 * Action to set hashes to FileAndFolders
 * @param hashes
 */
export const setFilesAndFoldersHashes = (
  hashes: HashesMap
): HashesActionTypes => ({
  hashes,
  type: SET_FILES_AND_FOLDERS_HASHES,
});

/**
 * Action to set hashes to FileAndFolders
 * @param hashes
 */
export const resetErroredHashes = (): HashesActionTypes => ({
  type: RESET_ERRORED_HASHES,
});

/**
 * Action to set hashes to FileAndFolders
 * @param hashPaths
 */
export const addErroredHashes = (
  hashErrors: ArchifiltreError[]
): HashesActionTypes => ({
  hashErrors,
  type: ADD_ERRORED_HASHES,
});
