import path from "path";
import { tap } from "rxjs/operators";
import { reportError } from "logging/reporter";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { setFilesAndFoldersHashes } from "reducers/files-and-folders/files-and-folders-actions";
import {
  getFilesAndFoldersFromStore,
  getFilesMap,
  getHashesFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import {
  completeLoadingAction,
  progressLoadingAction,
  registerErrorAction,
} from "reducers/loading-info/loading-info-actions";
import { startLoading } from "reducers/loading-info/loading-info-operations";
import {
  ArchifiltreError,
  LoadingInfoTypes,
} from "reducers/loading-info/loading-info-types";
import translations from "translations/translations";
import {
  NotificationDuration,
  notifyError,
} from "util/notification/notifications-util";
import { operateOnDataProcessingStream } from "util/observable/observable-util";
import {
  computeFolderHashes$,
  computeHashes$,
} from "./hash-computer.controller";
import { openModalAction } from "reducers/modal/modal-actions";
import { Modal } from "reducers/modal/modal-types";
import { of } from "rxjs";

type ComputeHashesThunkOptions = {
  ignoreFileHashes?: boolean;
};

/**
 * Thunk that computes files and folders hashes
 * @param originalPath
 * @param options
 * @param options.ignoreFileHashes - allows to ignore file hashes computation if they have already been loaded.
 */
export const computeHashesThunk = (
  originalPath: string,
  { ignoreFileHashes = false }: ComputeHashesThunkOptions = {
    ignoreFileHashes: false,
  }
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

    const fileHashesComputer$ = ignoreFileHashes
      ? of()
      : operateOnDataProcessingStream(hashes$, {
          error: tap((errors: ArchifiltreError[]) => {
            reportError(errors);
            errors.forEach((error) => dispatch(registerErrorAction(error)));
            loadingErrorsCount++;
          }),
          result: tap(onNewHashesComputed),
        });

    if (ignoreFileHashes) {
      dispatch(
        progressLoadingAction(
          loadingActionId,
          Object.keys(getHashesFromStore(getState())).length
        )
      );
    }

    fileHashesComputer$.subscribe({
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
                NotificationDuration.PERMANENT,
                () => dispatch(openModalAction(Modal.ERROR_MODAL))
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
