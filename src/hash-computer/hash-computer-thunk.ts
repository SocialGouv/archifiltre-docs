import path from "path";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { setFilesAndFoldersHashes } from "../reducers/files-and-folders/files-and-folders-actions";
import {
  getFilesAndFoldersFromStore,
  getFilesMap,
  getHashesFromStore
} from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  computeFolderHashes$,
  computeHashes$
} from "./hash-computer.controller";

/**
 * Thunk that computes files and folders hashes
 * @param originalPath
 */
export const computeHashesThunk = (
  originalPath: string
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const state = getState();

  const basePath = originalPath
    .split(path.sep)
    .slice(0, -1)
    .join(path.sep);

  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const ffIds = Object.keys(getFilesMap(filesAndFolders));

  return new Promise(resolve => {
    computeHashes$(ffIds, { initialValues: { basePath } }).subscribe({
      complete: () => {
        const hashes = getHashesFromStore(getState());
        computeFolderHashes$({ filesAndFolders, hashes }).subscribe({
          complete: resolve,
          next: newHashes => dispatch(setFilesAndFoldersHashes(newHashes))
        });
      },
      next: hashes => dispatch(setFilesAndFoldersHashes(hashes))
    });
  });
};
