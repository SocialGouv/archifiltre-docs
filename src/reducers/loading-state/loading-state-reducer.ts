import {
  LoadingState,
  LoadingStateAction,
  LoadingStep,
  SET_LOADING_STEP,
} from "./loading-state-types";
import undoable from "../enhancers/undoable/undoable";

export const initialState: LoadingState = {
  step: LoadingStep.WAITING,
};

export const loadingStateReducer = (
  state = initialState,
  action: LoadingStateAction
): LoadingState => {
  switch (action.type) {
    case SET_LOADING_STEP:
      return {
        ...state,
        step: action.step,
      };
    default:
      return state;
  }
};

export default undoable(loadingStateReducer, initialState);
