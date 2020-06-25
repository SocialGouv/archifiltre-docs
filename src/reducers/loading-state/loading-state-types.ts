export const SET_LOADING_STEP = "loadingState/SET_LOADING_STEP";

export enum LoadingStep {
  WAITING,
  STARTED,
  FINISHED,
  ERROR,
}

export type LoadingState = {
  step: LoadingStep;
};

export type SetLoadingStep = {
  type: typeof SET_LOADING_STEP;
  step: LoadingStep;
};

export type LoadingStateAction = SetLoadingStep;
