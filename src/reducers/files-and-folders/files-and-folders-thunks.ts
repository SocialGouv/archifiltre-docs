import { ArchifiltreThunkAction } from "../archifiltre-types";
import { setFilesAndFoldersHashes } from "./files-and-folders-actions";

interface FfHashMap {
  [fileAndFoldersId: string]: string;
}

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFolderHashes = (
  hashes: FfHashMap
): ArchifiltreThunkAction => dispatch => {
  dispatch(setFilesAndFoldersHashes(hashes));
};
