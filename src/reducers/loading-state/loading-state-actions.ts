import {
  LoadingStateAction,
  LoadingStep,
  SET_LOADING_STEP,
} from "./loading-state-types";

export const setLoadingStep = (step: LoadingStep): LoadingStateAction => ({
  step,
  type: SET_LOADING_STEP,
});
