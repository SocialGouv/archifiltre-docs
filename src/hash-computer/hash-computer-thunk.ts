import path from "path";
import { tap } from "rxjs/operators";
import { reportError } from "../logging/reporter";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { setFilesAndFoldersHashes } from "../reducers/files-and-folders/files-and-folders-actions";
import {
  getFilesAndFoldersFromStore,
  getFilesMap,
  getHashesFromStore,
} from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "../reducers/loading-info/loading-info-actions";
import { startLoading } from "../reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "../reducers/loading-info/loading-info-types";
import translations from "../translations/translations";
import { NotificationDuration, notifyError } from "../util/notifications-util";
import { operateOnDataProcessingStream } from "../util/observable-util";
import {
  computeFolderHashes$,
  computeHashes$,
} from "./hash-computer.controller";

/**
 * Thunk that computes files and folders hashes
 * @param originalPath
 */
export const computeHashesThunk = (
  originalPath: string
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const state = getState();

  const basePath = originalPath.split(path.sep).slice(0, -1).join(path.sep);

  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const ffIds = Object.keys(getFilesMap(filesAndFolders));

  const nbFilesAndFolders = Object.keys(filesAndFolders).length;

  const loadingHashLabel = translations.t("hash.loadingInfoLabel");

  return new Promise((resolve) => {
    const loadingActionId = dispatch(
      startLoading(
        LoadingInfoTypes.HASH_COMPUTING,
        nbFilesAndFolders,
        loadingHashLabel
      )
    );

    const hashes$ = computeHashes$(ffIds, { initialValues: { basePath } });
    const onNewHashesComputed = (newHashes) => {
      dispatch(
        progressLoadingAction(loadingActionId, Object.keys(newHashes).length)
      );
      dispatch(setFilesAndFoldersHashes(newHashes));
    };
    let loadingErrorsCount = 0;
    operateOnDataProcessingStream(hashes$, {
      // tslint:disable-next-line:no-console
      error: tap((error) => {
        reportError(error);
        loadingErrorsCount++;
      }),
      result: tap(onNewHashesComputed),
    }).subscribe({
      complete: () => {
        const hashes = getHashesFromStore(getState());
        computeFolderHashes$({ filesAndFolders, hashes }).subscribe({
          complete: () => {
            dispatch(completeLoadingAction(loadingActionId));
            if (loadingErrorsCount > 0) {
              const loadingErrorMessage = translations.t(
                "hash.loadingErrorMessage"
              );
              const hashTitle = translations.t("hash.title");
              notifyError(
                loadingErrorMessage,
                hashTitle,
                NotificationDuration.PERMANENT
              );
            }
            resolve();
          },
          next: onNewHashesComputed,
        });
      },
    });
  });
};
