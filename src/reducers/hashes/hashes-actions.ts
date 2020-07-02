import {
  HashesActionTypes,
  HashesMap,
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
