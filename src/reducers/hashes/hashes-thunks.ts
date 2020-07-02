import { HashesMap } from "./hashes-types";
import { ArchifiltreThunkAction } from "../archifiltre-types";
import { setFilesAndFoldersHashes } from "./hashes-actions";

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFoldersHashes = (
  hashes: HashesMap
): ArchifiltreThunkAction => (dispatch) => {
  dispatch(setFilesAndFoldersHashes(hashes));
};
