import { ArchifiltreThunkAction } from "../archifiltre-types";
import { setFilesAndFoldersHash } from "./files-and-folders-actions";

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
  Object.entries(hashes).forEach(([ffId, ffHash]) => {
    dispatch(setFilesAndFoldersHash(ffId, ffHash));
  });
};
