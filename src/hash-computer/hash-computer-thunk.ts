import path from "path";
import { tap, map } from "rxjs/operators";
import { map as lodashMap } from "lodash/fp";
import { reportError } from "logging/reporter";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import {
  getFilesAndFoldersFromStore,
  getFilesMap,
  getFoldersCount,
} from "reducers/files-and-folders/files-and-folders-selectors";
import {
  completeLoadingAction,
  progressLoadingAction,
  replaceErrorsAction,
  updateLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import { startLoading } from "reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import translations from "translations/translations";
import { NotificationDuration, notifyError, notifySuccess, } from "util/notification/notifications-util";
import { computeFolderHashes$, } from "hash-computer/hash-computer.controller";
import { openModalAction } from "reducers/modal/modal-actions";
import { Modal } from "reducers/modal/modal-types";
import { addErroredHashes, resetErroredHashes, setFilesAndFoldersHashes, } from "reducers/hashes/hashes-actions";
import { getErroredHashesFromStore, getHashesFromStore, } from "reducers/hashes/hashes-selectors";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { ArchifiltreErrorType } from "util/error/error-util";
import {
  computeHashes,
  HashComputingResult,
  hashErrorToArchifiltreError,
  hashResultsToMap
} from "../util/hash/hash-util";
import { pipe } from "rxjs";

const computeFileHashesIgnoredThunk = (
  loadingActionId: string,
  filesCount: number
): ArchifiltreThunkAction<number> => (dispatch): number => {
  dispatch(progressLoadingAction(loadingActionId, filesCount));
  return 0;
};

const computeFileHashesImplThunk = (
  originalPath: string,
  fileIds: string[],
  loadingActionId: string
): ArchifiltreThunkAction<Promise<number>> => async (
  dispatch
): Promise<number> => {
    dispatch(resetErroredHashes());
    const basePath = path.dirname(originalPath);
    const hashes$ = computeHashes(fileIds, basePath);

    const getRelativePath = (filePath: string): string => `/${path.relative(basePath, filePath)}`;

    const formatResult = pipe(
      lodashMap(({ path, ...rest }: HashComputingResult): HashComputingResult => ({
        ...rest,
        path: getRelativePath(path)
      })),
      hashResultsToMap,
    )

    const result = await hashes$
      .pipe(
        map(({ errors, results, ...rest }) => ({
          ...rest,
          results: formatResult(results),
          errors: errors.map(hashErrorToArchifiltreError)
        })),
        tap(({ results, errors }) => {
          dispatch(
            updateLoadingAction(loadingActionId, Object.keys(results).length + errors.length)
          );
          dispatch(setFilesAndFoldersHashes(results));
          dispatch(replaceErrorsAction(
            errors,
            ArchifiltreErrorType.COMPUTING_HASHES
          ))
        })
      ).toPromise();

    if (result.errors.length) {
      reportError(result.errors);
      dispatch(
        addErroredHashes(
          result.errors.map(({ filePath, ...rest }) => ({ ...rest, filePath: getRelativePath(filePath) }))
        )
      );
    }

    return result.errors.length;
  };

type ComputeFileHashesThunkOptions = {
  loadingActionId: string;
  ignoreFileHashes: boolean;
  originalPath: string;
};

const computeFileHashesThunk = (
  filePaths: string[],
  {
    loadingActionId,
    ignoreFileHashes,
    originalPath,
  }: ComputeFileHashesThunkOptions
): ArchifiltreThunkAction<Promise<number>> => async (
  dispatch
): Promise<number> => {
    const filesCount = filePaths.length;

    return ignoreFileHashes
      ? dispatch(computeFileHashesIgnoredThunk(loadingActionId, filesCount))
      : dispatch(
        computeFileHashesImplThunk(originalPath, filePaths, loadingActionId)
      );
  };

const computeFolderHashesThunk = (
  loadingActionId: string
): ArchifiltreThunkAction<Promise<void>> => async (dispatch, getState) => {
  return new Promise((resolve) => {
    const state = getState();
    const hashes = getHashesFromStore(state);
    const filesAndFolders = getFilesAndFoldersFromStore(state);
    const onNewHashesComputed = (newHashes) => {
      dispatch(
        progressLoadingAction(loadingActionId, Object.keys(newHashes).length)
      );
      dispatch(setFilesAndFoldersHashes(newHashes));
    };

    computeFolderHashes$({ filesAndFolders, hashes }).subscribe({
      complete: () => {
        resolve();
      },
      next: onNewHashesComputed,
    });
  });
};

type ComputeHashesThunkOptions = {
  ignoreFileHashes?: boolean;
  hashesLoadingLabel: string;
  originalPath: string;
};

/**
 * Thunk that computes files and folders hashes
 * @param filePaths
 * @param originalPath
 * @param options
 * @param options.ignoreFileHashes - allows to ignore file hashes computation if they have already been loaded.
 */
export const computeHashesThunk = (
  filePaths: string[],
  {
    ignoreFileHashes = false,
    originalPath,
    hashesLoadingLabel,
  }: ComputeHashesThunkOptions
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const state = getState();
  const filesAndFolders = getFilesAndFoldersFromStore(state);

  // We also compute the root folder hash
  const foldersCount = getFoldersCount(filesAndFolders) + 1;

  const loadingActionId = dispatch(
    startLoading(
      LoadingInfoTypes.HASH_COMPUTING,
      foldersCount + filePaths.length,
      hashesLoadingLabel
    )
  );

  const fileHashesErrorsCount = await dispatch(
    computeFileHashesThunk(filePaths, {
      loadingActionId,
      ignoreFileHashes,
      originalPath,
    })
  );

  await dispatch(computeFolderHashesThunk(loadingActionId));

  dispatch(completeLoadingAction(loadingActionId));

  notifySuccess(
    translations.t("audit.reportReadyMessage"),
    translations.t("audit.report")
  );

  if (fileHashesErrorsCount > 0) {
    const loadingErrorMessage = translations.t("hash.loadingErrorMessage");
    const hashTitle = translations.t("hash.title");
    notifyError(
      loadingErrorMessage,
      hashTitle,
      NotificationDuration.PERMANENT,
      () => dispatch(openModalAction(Modal.HASHES_ERROR_MODAL))
    );
  }
};

type FirstHashesComputingThunkOptions = {
  ignoreFileHashes?: boolean;
};

export const firstHashesComputingThunk = (
  originalPath: string,
  { ignoreFileHashes = false }: FirstHashesComputingThunkOptions = {
    ignoreFileHashes: false,
  }
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const state = getState();

  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filePaths = Object.keys(getFilesMap(filesAndFolders));

  const hashesLoadingLabel = translations.t("hash.loadingInfoLabel");

  await dispatch(
    computeHashesThunk(filePaths, {
      originalPath,
      ignoreFileHashes,
      hashesLoadingLabel,
    })
  );
};

export const retryHashesComputingThunk = (): ArchifiltreThunkAction => async (
  dispatch,
  getState
) => {
  const state = getState();

  const hashErrors = getErroredHashesFromStore(state);
  const { originalPath } = getWorkspaceMetadataFromStore(state);
  const hashesLoadingLabel = translations.t("hash.loadingInfoLabel");
  const erroredPaths = hashErrors.map(({ filePath }) => filePath);

  await dispatch(
    computeHashesThunk(erroredPaths, {
      originalPath,
      ignoreFileHashes: false,
      hashesLoadingLabel,
    })
  );
};
