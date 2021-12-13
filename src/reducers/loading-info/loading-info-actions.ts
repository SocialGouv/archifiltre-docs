import type {
  ArchifiltreError,
  ArchifiltreErrorType,
} from "../../util/error/error-util";
import type { LoadingInfoAction, LoadingInfoTypes } from "./loading-info-types";
import {
  COMPLETE_LOADING,
  DISMISS_ALL_COMPLETE,
  PROGRESS_LOADING,
  REGISTER_ERROR,
  REPLACE_ERRORS,
  RESET_LOADING,
  START_LOADING,
  UPDATE_LOADING,
} from "./loading-info-types";

/**
 * Action to start a loading display
 * @param id - the loading id
 * @param type - the loading type
 * @param goal - the goal to reach for completion
 * @param label - the action label
 */
export const startLoadingAction = (
  id: string,
  type: LoadingInfoTypes,
  goal: number,
  label: string,
  loadedLabel: string
): LoadingInfoAction => ({
  goal,
  id,
  label,
  loadedLabel,
  loadingType: type,
  type: START_LOADING,
});

/**
 * Update a current loading info
 * @param id - the loading id
 * @param progress - the progress
 * @param goal - the goal to reach for completion
 */
export const updateLoadingAction = (
  id: string,
  progress?: number,
  goal?: number
): LoadingInfoAction => ({
  goal,
  id,
  progress,
  type: UPDATE_LOADING,
});

/**
 * Adds progress count to the progress of a current loading info
 * @param id - the loading id
 * @param progress
 */
export const progressLoadingAction = (
  id: string,
  progress: number
): LoadingInfoAction => ({
  id,
  progress,
  type: PROGRESS_LOADING,
});

/**
 * Completes a loading.
 * @param id
 */
export const completeLoadingAction = (id: string): LoadingInfoAction => ({
  id,
  type: COMPLETE_LOADING,
});

/**
 * Register an error to the error stack
 * @param error
 */
export const registerErrorAction = (
  error: ArchifiltreError
): LoadingInfoAction => ({
  error,
  type: REGISTER_ERROR,
});

export const replaceErrorsAction = (
  errors: ArchifiltreError[],
  errorType: ArchifiltreErrorType
): LoadingInfoAction => ({
  errorType,
  errors,
  type: REPLACE_ERRORS,
});

/**
 * Resets the loading data.
 */
export const resetLoadingAction = (): LoadingInfoAction => ({
  type: RESET_LOADING,
});

/**
 * Dismisses all the complete loadingInfo
 */
export const dismissAllComplete = (): LoadingInfoAction => ({
  type: DISMISS_ALL_COMPLETE,
});
