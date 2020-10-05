export const SET_LOADING_STEP = "loadingState/SET_LOADING_STEP";
export const SET_FILE_SYSTEM_LOADING_STEP =
  "loadingState/SET_FILE_SYSTEM_LOADING_STEP";
export const SET_INDEXED_FILES_COUNT = "loadingState/SET_INDEXED_FILES_COUNT";
export const SET_DATA_MODEL_ELEMENTS_COUNT =
  "loadingState/SET_DATA_MODEL_ELEMENTS_COUNT";
export const SET_DERIVED_ELEMENTS_COUNT =
  "loadingState/SET_DERIVED_ELEMENTS_COUNT";
export const RESET_LOADING_STATE = "loadingState/RESET_LOADING_STATE";

export const loadingStateActionTypes = [
  SET_LOADING_STEP,
  SET_FILE_SYSTEM_LOADING_STEP,
  SET_INDEXED_FILES_COUNT,
  SET_DATA_MODEL_ELEMENTS_COUNT,
  SET_DERIVED_ELEMENTS_COUNT,
  RESET_LOADING_STATE,
];

export enum LoadingStep {
  WAITING,
  FINISHED,
  ERROR,
}

export enum FileSystemLoadingStep {
  INDEXING,
  FILES_AND_FOLDERS,
  METADATA,
  COMPLETE,
}

export type LoadingState = {
  step: LoadingStep;
  fileSystemLoadingStep: FileSystemLoadingStep;
  indexedFilesCount: number;
  constructedDataModelElementsCount: number;
  derivedElementsCount: number;
};

type SetLoadingStep = {
  type: typeof SET_LOADING_STEP;
  step: LoadingStep;
};

type SetFileSystemLoadingStep = {
  type: typeof SET_FILE_SYSTEM_LOADING_STEP;
  step: FileSystemLoadingStep;
};

type SetIndexedFilesCount = {
  type: typeof SET_INDEXED_FILES_COUNT;
  count: number;
};

type SetConstructedDataModelElementsCount = {
  type: typeof SET_DATA_MODEL_ELEMENTS_COUNT;
  count: number;
};

type SetDerivedElementsCount = {
  type: typeof SET_DERIVED_ELEMENTS_COUNT;
  count: number;
};

type ResetLoadingState = {
  type: typeof RESET_LOADING_STATE;
};

export type LoadingStateAction =
  | SetLoadingStep
  | SetFileSystemLoadingStep
  | SetIndexedFilesCount
  | SetConstructedDataModelElementsCount
  | SetDerivedElementsCount
  | ResetLoadingState;
