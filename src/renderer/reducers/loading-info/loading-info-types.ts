import type {
  ArchifiltreDocsError,
  ArchifiltreDocsErrorType,
} from "@common/utils/error";

export const START_LOADING = "LOADING_INFO/START_LOADING";
export const UPDATE_LOADING = "LOADING_INFO/UPDATE_LOADING";
export const PROGRESS_LOADING = "LOADING_INFO/PROGRESS_LOADING";
export const COMPLETE_LOADING = "LOADING_INFO/COMPLETE_LOADING";
export const ADD_EXPORTED_PATH = "LOADING_INFO/ADD_EXPORTED_PATH";
export const REGISTER_ERROR = "LOADING_INFO/REGISTER_ERROR";
export const REPLACE_ERRORS = "LOADING_INFO/REPLACE_ERRORS";
export const RESET_LOADING = "LOADING_INFO/RESET_LOADING";
export const DISMISS_ALL_COMPLETE = "LOADING_INFO/DISMISS_ALL_COMPLETE";

export enum LoadingInfoTypes {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  EXPORT = "export",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  HASH_COMPUTING = "hash-computing",
}

export interface LoadingInfo {
  exportedPath?: string;
  goal: number;
  id: string;
  label: string;
  loadedLabel: string;
  progress: number;
  type: LoadingInfoTypes;
}

export type LoadingInfoMap = Record<string, LoadingInfo>;

export interface LoadingInfoState {
  complete: string[];
  dismissed: string[];
  errors: ArchifiltreDocsError[];
  loading: string[];
  loadingInfo: LoadingInfoMap;
}

interface StartLoadingAction {
  exportedPath?: string;
  goal: number;
  id: string;
  label: string;
  loadedLabel: string;
  loadingType: LoadingInfoTypes;
  type: typeof START_LOADING;
}

interface UpdateLoadingAction {
  goal?: number;
  id: string;
  progress?: number;
  type: typeof UPDATE_LOADING;
}

interface ProgressLoadingAction {
  id: string;
  progress: number;
  type: typeof PROGRESS_LOADING;
}

interface CompleteLoadingAction {
  id: string;
  type: typeof COMPLETE_LOADING;
}

interface AddExportedPathAction {
  exportedPath: string;
  id: string;
  type: typeof ADD_EXPORTED_PATH;
}

interface RegisterErrorAction {
  error: ArchifiltreDocsError;
  type: typeof REGISTER_ERROR;
}

interface ReplaceErrorsAction {
  errorType: ArchifiltreDocsErrorType;
  errors: ArchifiltreDocsError[];
  type: typeof REPLACE_ERRORS;
}

interface ResetLoadingAction {
  type: typeof RESET_LOADING;
}

interface DismissAllComplete {
  type: typeof DISMISS_ALL_COMPLETE;
}

export type LoadingInfoAction =
  | AddExportedPathAction
  | CompleteLoadingAction
  | DismissAllComplete
  | ProgressLoadingAction
  | RegisterErrorAction
  | ReplaceErrorsAction
  | ResetLoadingAction
  | StartLoadingAction
  | UpdateLoadingAction;
