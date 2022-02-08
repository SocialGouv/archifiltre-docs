import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { setFilesAndFoldersHashes } from "./hashes-actions";
import type { HashesMap } from "./hashes-types";

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFoldersHashes =
  (hashes: HashesMap): ArchifiltreDocsThunkAction =>
  (dispatch) => {
    dispatch(setFilesAndFoldersHashes(hashes));
  };
