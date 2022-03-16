import type { ArchifiltreDocsError } from "@common/utils/error";

import type { HashesActionTypes, HashesMap } from "./hashes-types";
import {
  ADD_ERRORED_HASHES,
  RESET_ERRORED_HASHES,
  SET_FILES_AND_FOLDERS_HASHES,
} from "./hashes-types";

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
  hashErrors: ArchifiltreDocsError[]
): HashesActionTypes => ({
  hashErrors,
  type: ADD_ERRORED_HASHES,
});
