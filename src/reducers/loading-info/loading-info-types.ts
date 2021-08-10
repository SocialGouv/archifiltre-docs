import { ArchifiltreError } from "util/error/error-util";

export const START_LOADING = "LOADING_INFO/START_LOADING";
export const UPDATE_LOADING = "LOADING_INFO/UPDATE_LOADING";
export const PROGRESS_LOADING = "LOADING_INFO/PROGRESS_LOADING";
export const COMPLETE_LOADING = "LOADING_INFO/COMPLETE_LOADING";
export const ADD_EXPORTED_PATH = "LOADING_INFO/ADD_EXPORTED_PATH";
export const REGISTER_ERROR = "LOADING_INFO/REGISTER_ERROR";
export const RESET_LOADING = "LOADING_INFO/RESET_LOADING";
export const DISMISS_ALL_COMPLETE = "LOADING_INFO/DISMISS_ALL_COMPLETE";

export enum LoadingInfoTypes {
  HASH_COMPUTING = "hash-computing",
  EXPORT = "export",
}

export interface LoadingInfo {
  id: string;
  type: LoadingInfoTypes;
  progress: number;
  goal: number;
  label: string;
  loadedLabel: string;
  exportedPath?: string;
}

export interface LoadingInfoMap {
  [id: string]: LoadingInfo;
}

export interface LoadingInfoState {
  loadingInfo: LoadingInfoMap;
  loading: string[];
  complete: string[];
  dismissed: string[];
  errors: ArchifiltreError[];
}

interface StartLoadingAction {
  type: typeof START_LOADING;
  id: string;
  loadingType: LoadingInfoTypes;
  goal: number;
  label: string;
  loadedLabel: string;
  exportedPath?: string;
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

interface AddExportedPathAction {
  type: typeof ADD_EXPORTED_PATH;
  id: string;
  exportedPath: string;
}

interface RegisterErrorAction {
  type: typeof REGISTER_ERROR;
  error: ArchifiltreError;
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
  | RegisterErrorAction
  | ResetLoadingAction
  | DismissAllComplete
  | AddExportedPathAction;
