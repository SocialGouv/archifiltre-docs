import path from "path";
import { tap } from "rxjs/operators";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { setFilesAndFoldersHashes } from "../reducers/files-and-folders/files-and-folders-actions";
import {
  getFilesAndFoldersFromStore,
  getFilesMap,
  getHashesFromStore
} from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  completeLoadingAction,
  progressLoadingAction,
  startLoadingAction
} from "../reducers/loading-info/loading-info-actions";
import { LoadingInfoTypes } from "../reducers/loading-info/loading-info-types";
import translations from "../translations/translations";
import { operateOnDataProcessingStream } from "../util/observable-util";
import {
  computeFolderHashes$,
  computeHashes$
} from "./hash-computer.controller";

export const LOAD_FILE_FOLDER_HASH_ACTION_ID = "load-files-and-folders";

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

  const nbFilesAndFolders = Object.keys(filesAndFolders).length;

  const loadingHashLabel = translations.t("hash.loadingInfoLabel");

  return new Promise(resolve => {
    dispatch(
      startLoadingAction(
        LOAD_FILE_FOLDER_HASH_ACTION_ID,
        LoadingInfoTypes.HASH_COMPUTING,
        nbFilesAndFolders,
        loadingHashLabel
      )
    );

    const hashes$ = computeHashes$(ffIds, { initialValues: { basePath } });
    const onNewHashesComputed = newHashes => {
      dispatch(
        progressLoadingAction(
          LOAD_FILE_FOLDER_HASH_ACTION_ID,
          Object.keys(newHashes).length
        )
      );
      dispatch(setFilesAndFoldersHashes(newHashes));
    };

    operateOnDataProcessingStream(hashes$, {
      // tslint:disable-next-line:no-console
      error: tap(console.error),
      result: tap(onNewHashesComputed)
    }).subscribe({
      complete: () => {
        const hashes = getHashesFromStore(getState());
        computeFolderHashes$({ filesAndFolders, hashes }).subscribe({
          complete: () => {
            dispatch(completeLoadingAction(LOAD_FILE_FOLDER_HASH_ACTION_ID));
            resolve();
          },
          next: onNewHashesComputed
        });
      }
    });
  });
};
