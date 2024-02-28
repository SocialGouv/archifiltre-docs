import { ArchifiltreDocsErrorType } from "@common/utils/error";
import type { HashComputingResult } from "@common/utils/hash";
import {
  computeHashes,
  hashErrorToArchifiltreDocsError,
} from "@common/utils/hash";
import type { HashesMap } from "@common/utils/hashes-types";
import path from "path";
import type { Dispatch } from "react";
import type { AnyAction } from "redux";
import { map, tap } from "rxjs/operators";

import { reportError } from "../logging/reporter";
import type { ArchifiltreDocsThunkAction } from "../reducers/archifiltre-types";
import {
  getFilesAndFoldersFromStore,
  getFilesMap,
} from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  addErroredHashes,
  resetErroredHashes,
  setFilesAndFoldersHashes,
} from "../reducers/hashes/hashes-actions";
import {
  getErroredHashesFromStore,
  getHashesFromStore,
} from "../reducers/hashes/hashes-selectors";
import {
  completeLoadingAction,
  progressLoadingAction,
  replaceErrorsAction,
  updateLoadingAction,
} from "../reducers/loading-info/loading-info-actions";
import { startLoading } from "../reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "../reducers/loading-info/loading-info-types";
import { openModalAction } from "../reducers/modal/modal-actions";
import { Modal } from "../reducers/modal/modal-types";
import { getWorkspaceMetadataFromStore } from "../reducers/workspace-metadata/workspace-metadata-selectors";
import { translations } from "../translations/translations";
import { getFoldersCount, getRelativePath } from "../utils";
import {
  NotificationDuration,
  notifyError,
  notifySuccess,
} from "../utils/notifications";
import { computeFolderHashes$ } from "./hash-computer.controller";

const computeFileHashesIgnoredThunk =
  (
    loadingActionId: string,
    filesCount: number
  ): ArchifiltreDocsThunkAction<number> =>
  (dispatch): number => {
    dispatch(progressLoadingAction(loadingActionId, filesCount));
    return 0;
  };

/**
 * Creates a thunk action to compute hashes for specified files.
 * @param originalPath The original path of the folder containing the files.
 * @param fileIds The IDs of the files for which to compute hashes.
 * @param loadingActionId The ID of the loading action to update.
 * @returns A thunk function that, when executed, initiates the computation of hashes and updates the Redux store accordingly.
 */
const computeFileHashesImplThunk =
  (
    originalPath: string,
    fileIds: string[],
    loadingActionId: string
  ): ArchifiltreDocsThunkAction<Promise<number>> =>
  async (dispatch: Dispatch<AnyAction>): Promise<number> => {
    dispatch(resetErroredHashes());
    const basePath = path.dirname(originalPath);
    const hashes$ = computeHashes(fileIds, basePath);

    /**
     * Formats the hash computation results into a HashesMap, mapping file paths to their hashes or null.
     * @param hashResults The results from the hash computation.
     * @returns A HashesMap mapping relative paths to hash strings or null.
     */
    const formatResult = (hashResults: HashComputingResult[]): HashesMap => {
      const formattedResults: HashesMap = {};
      hashResults.forEach(({ path: resultPath, hash }) => {
        const relativePath = getRelativePath(basePath, resultPath);
        formattedResults[relativePath] = hash || null;
      });
      return formattedResults;
    };

    const result = await hashes$
      .pipe(
        map(({ errors, results, ...rest }) => ({
          ...rest,
          errors: errors.map(hashErrorToArchifiltreDocsError), // Assuming this function exists
          results: formatResult(results),
        })),
        tap(({ results, errors }) => {
          dispatch(
            updateLoadingAction(
              loadingActionId,
              Object.keys(results).length + errors.length
            )
          );
          dispatch(setFilesAndFoldersHashes(results));
          dispatch(
            replaceErrorsAction(
              errors,
              ArchifiltreDocsErrorType.COMPUTING_HASHES
            )
          );
        })
      )
      .toPromise();

    if (result.errors.length) {
      reportError(result.errors);
      dispatch(
        addErroredHashes(
          result.errors.map(({ filePath, ...rest }) => ({
            ...rest,
            filePath: getRelativePath(basePath, filePath),
          }))
        )
      );
    }

    return result.errors.length;
  };

interface ComputeFileHashesThunkOptions {
  ignoreFileHashes: boolean;
  loadingActionId: string;
  originalPath: string;
}

/**
 * Thunk action to compute hashes for given file paths. It can optionally ignore the computation
 * if the file hashes have already been loaded, to optimize performance.
 *
 * @param filePaths - An array of file paths for which hashes need to be computed.
 * @param options - Options controlling how file hashes are computed.
 * @param options.ignoreFileHashes - If true, skips the hash computation for files.
 * @param options.loadingActionId - An identifier for the loading action, used to track the progress.
 * @param options.originalPath - The original path used as a reference for hash computation.
 * @returns A promise that resolves to the number of files for which hashes were computed or ignored.
 */
const computeFileHashesThunk =
  (
    filePaths: string[],
    {
      loadingActionId,
      ignoreFileHashes,
      originalPath,
    }: ComputeFileHashesThunkOptions
  ): ArchifiltreDocsThunkAction<Promise<number>> =>
  async (dispatch): Promise<number> => {
    const filesCount = filePaths.length;

    if (ignoreFileHashes) {
      return dispatch(
        computeFileHashesIgnoredThunk(loadingActionId, filesCount)
      );
    }

    return dispatch(
      computeFileHashesImplThunk(originalPath, filePaths, loadingActionId)
    );
  };

const computeFolderHashesThunk =
  (loadingActionId: string): ArchifiltreDocsThunkAction<Promise<void>> =>
  async (dispatch, getState) => {
    return new Promise((resolve) => {
      const state = getState();
      const hashes = getHashesFromStore(state);
      const filesAndFolders = getFilesAndFoldersFromStore(state);
      const onNewHashesComputed = (newHashes: HashesMap) => {
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

/**
 * Handles errors related to hash computation, triggering a notification and opening a modal.
 * @param dispatch The Redux dispatch function.
 */
const handleHashesError = (dispatch: Dispatch<AnyAction>) => {
  const loadingErrorMessage = translations.t("hash.loadingErrorMessage");
  const hashTitle = translations.t("hash.title");
  notifyError(
    loadingErrorMessage,
    hashTitle,
    NotificationDuration.PERMANENT,
    () => {
      dispatch(openModalAction(Modal.HASHES_ERROR_MODAL));
    }
  );
};

interface ComputeHashesThunkOptions {
  hashesLoadedLabel: string;
  hashesLoadingLabel: string;
  ignoreFileHashes?: boolean;
  originalPath: string;
}

/**
 * Thunk function that computes hashes for a list of files and folders.
 * It optionally skips file hash computation if they are already loaded.
 * This function initiates loading, computes file and folder hashes, and then completes the loading process.
 * On success, it notifies the user that the report is ready. On failure, it shows an error notification.
 *
 * @param {string[]} filePaths - The paths of the files for which to compute hashes.
 * @param {ComputeHashesThunkOptions} options - The options for hash computation.
 * @param {boolean} options.ignoreFileHashes - If true, skips computation of file hashes if they are already loaded.
 * @param {string} options.originalPath - The original path of the files and folders.
 * @param {string} options.hashesLoadingLabel - The label to show while hashes are being computed.
 * @param {string} options.hashesLoadedLabel - The label to show once hashes computation is completed.
 * @returns {ArchifiltreDocsThunkAction} A thunk action that performs the hash computation process.
 */
export const computeHashesThunk =
  (
    filePaths: string[],
    {
      ignoreFileHashes = false,
      originalPath,
      hashesLoadingLabel,
      hashesLoadedLabel,
    }: ComputeHashesThunkOptions
  ): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    const state = getState();
    const filesAndFolders = getFilesAndFoldersFromStore(state);
    const foldersCount = getFoldersCount(filesAndFolders) + 1;

    const loadingActionId = dispatch(
      startLoading(
        LoadingInfoTypes.HASH_COMPUTING,
        foldersCount + filePaths.length,
        hashesLoadingLabel,
        hashesLoadedLabel
      )
    );

    const fileHashesErrorsCount = await dispatch(
      computeFileHashesThunk(filePaths, {
        ignoreFileHashes,
        loadingActionId,
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
      handleHashesError(dispatch);
    }
  };

interface FirstHashesComputingThunkOptions {
  ignoreFileHashes?: boolean;
}

export const firstHashesComputingThunk =
  (
    originalPath: string,
    { ignoreFileHashes = false }: FirstHashesComputingThunkOptions = {
      ignoreFileHashes: false,
    }
  ): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    const state = getState();

    const filesAndFolders = getFilesAndFoldersFromStore(state);
    const filePaths = Object.keys(getFilesMap(filesAndFolders));

    const hashesLoadingLabel = translations.t("hash.loadingInfoLabel");
    const hashesLoadedLabel = translations.t("hash.loadedInfoLabel");

    await dispatch(
      computeHashesThunk(filePaths, {
        hashesLoadedLabel,
        hashesLoadingLabel,
        ignoreFileHashes,
        originalPath,
      })
    );
  };

export const retryHashesComputingThunk =
  (): ArchifiltreDocsThunkAction => async (dispatch, getState) => {
    const state = getState();

    const hashErrors = getErroredHashesFromStore(state);
    const { originalPath } = getWorkspaceMetadataFromStore(state);
    const hashesLoadingLabel = translations.t("hash.loadingInfoLabel");
    const hashesLoadedLabel = translations.t("hash.loadedInfoLabel");
    const erroredPaths = hashErrors.map(({ filePath }) => filePath);

    await dispatch(
      computeHashesThunk(erroredPaths, {
        hashesLoadedLabel,
        hashesLoadingLabel,
        ignoreFileHashes: false,
        originalPath,
      })
    );
  };
