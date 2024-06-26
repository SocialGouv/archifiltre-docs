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

/* eslint-disable @typescript-eslint/naming-convention */
export enum LoadingStep {
  WAITING = 0,
  FINISHED = 1,
  ERROR = 2,
}

export enum FileSystemLoadingStep {
  FILES_AND_FOLDERS = "FILES_AND_FOLDERS",
  INDEXING = "INDEXING",
  METADATA = "METADATA",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface LoadingState {
  constructedDataModelElementsCount: number;
  derivedElementsCount: number;
  fileSystemLoadingStep: FileSystemLoadingStep;
  indexedFilesCount: number;
  step: LoadingStep;
}

interface SetLoadingStep {
  step: LoadingStep;
  type: typeof SET_LOADING_STEP;
}

interface SetFileSystemLoadingStep {
  step: FileSystemLoadingStep;
  type: typeof SET_FILE_SYSTEM_LOADING_STEP;
}

interface SetIndexedFilesCount {
  count: number;
  type: typeof SET_INDEXED_FILES_COUNT;
}

interface SetConstructedDataModelElementsCount {
  count: number;
  type: typeof SET_DATA_MODEL_ELEMENTS_COUNT;
}

interface SetDerivedElementsCount {
  count: number;
  type: typeof SET_DERIVED_ELEMENTS_COUNT;
}

interface ResetLoadingState {
  type: typeof RESET_LOADING_STATE;
}

export type LoadingStateAction =
  | ResetLoadingState
  | SetConstructedDataModelElementsCount
  | SetDerivedElementsCount
  | SetFileSystemLoadingStep
  | SetIndexedFilesCount
  | SetLoadingStep;
