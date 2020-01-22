export const START_LOADING = "LOADING_INFO/START_LOADING";
export const UPDATE_LOADING = "LOADING_INFO/UPDATE_LOADING";
export const PROGRESS_LOADING = "LOADING_INFO/PROGRESS_LOADING";
export const COMPLETE_LOADING = "LOADING_INFO/COMPLETE_LOADING";
export const RESET_LOADING = "LOADING_INFO/RESET_LOADING";
export const DISMISS_ALL_COMPLETE = "LOADING_INFO/DISMISS_ALL_COMPLETE";

export enum LoadingInfoTypes {
  HASH_COMPUTING = "hash-computing",
  EXPORT = "export"
}

export interface LoadingInfo {
  id: string;
  type: LoadingInfoTypes;
  progress: number;
  goal: number;
  label: string;
}

export interface LoadingInfoMap {
  [id: string]: LoadingInfo;
}

export interface LoadingInfoState {
  loadingInfo: LoadingInfoMap;
  loading: string[];
  complete: string[];
  dismissed: string[];
}

interface StartLoadingAction {
  type: typeof START_LOADING;
  id: string;
  loadingType: LoadingInfoTypes;
  goal: number;
  label: string;
}

interface UpdateLoadingAction {
  type: typeof UPDATE_LOADING;
  id: string;
  progress: number;
  goal: number;
}

interface ProgressLoadingAction {
  type: typeof PROGRESS_LOADING;
  id: string;
  progress: number;
}

interface CompleteLoadingAction {
  type: typeof COMPLETE_LOADING;
  id: string;
}

interface ResetLoadingAction {
  type: typeof RESET_LOADING;
}

interface DismissAllComplete {
  type: typeof DISMISS_ALL_COMPLETE;
}

export type LoadingInfoAction =
  | StartLoadingAction
  | UpdateLoadingAction
  | ProgressLoadingAction
  | CompleteLoadingAction
  | ResetLoadingAction
  | DismissAllComplete;
