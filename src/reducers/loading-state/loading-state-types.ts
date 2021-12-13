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
    INDEXING = 0,
    FILES_AND_FOLDERS = 1,
    METADATA = 2,
    COMPLETE = 3,
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface LoadingState {
    step: LoadingStep;
    fileSystemLoadingStep: FileSystemLoadingStep;
    indexedFilesCount: number;
    constructedDataModelElementsCount: number;
    derivedElementsCount: number;
}

interface SetLoadingStep {
    type: typeof SET_LOADING_STEP;
    step: LoadingStep;
}

interface SetFileSystemLoadingStep {
    type: typeof SET_FILE_SYSTEM_LOADING_STEP;
    step: FileSystemLoadingStep;
}

interface SetIndexedFilesCount {
    type: typeof SET_INDEXED_FILES_COUNT;
    count: number;
}

interface SetConstructedDataModelElementsCount {
    type: typeof SET_DATA_MODEL_ELEMENTS_COUNT;
    count: number;
}

interface SetDerivedElementsCount {
    type: typeof SET_DERIVED_ELEMENTS_COUNT;
    count: number;
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
