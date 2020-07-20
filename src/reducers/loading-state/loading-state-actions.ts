import {
  FileSystemLoadingStep,
  LoadingStateAction,
  LoadingStep,
  RESET_LOADING_STATE,
  SET_DATA_MODEL_ELEMENTS_COUNT,
  SET_DERIVED_ELEMENTS_COUNT,
  SET_FILE_SYSTEM_LOADING_STEP,
  SET_INDEXED_FILES_COUNT,
  SET_LOADING_STEP,
} from "./loading-state-types";

export const setLoadingStep = (step: LoadingStep): LoadingStateAction => ({
  step,
  type: SET_LOADING_STEP,
});

export const setFileSystemLoadingStep = (
  step: FileSystemLoadingStep
): LoadingStateAction => ({
  step,
  type: SET_FILE_SYSTEM_LOADING_STEP,
});

/**
 * Set the count of indexed files
 * @param count
 */
export const setIndexedFilesCount = (count: number): LoadingStateAction => ({
  count,
  type: SET_INDEXED_FILES_COUNT,
});

/**
 * Set the count of filesAndFolders generated
 * @param count
 */
export const setConstructedDataModelElementsCount = (
  count: number
): LoadingStateAction => ({
  count,
  type: SET_DATA_MODEL_ELEMENTS_COUNT,
});

/**
 * Set the count of metadata generated
 * @param count
 */
export const setDerivedElementsCount = (count: number): LoadingStateAction => ({
  count,
  type: SET_DERIVED_ELEMENTS_COUNT,
});

/**
 * Reset the loadingState
 */
export const resetLoadingState = (): LoadingStateAction => ({
  type: RESET_LOADING_STATE,
});
