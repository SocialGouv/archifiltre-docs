import type { ArchifiltreThunkAction } from "../archifiltre-types";
import { setFilesAndFoldersHashes } from "./hashes-actions";
import type { HashesMap } from "./hashes-types";

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFoldersHashes =
  (hashes: HashesMap): ArchifiltreThunkAction =>
  (dispatch) => {
    dispatch(setFilesAndFoldersHashes(hashes));
  };
