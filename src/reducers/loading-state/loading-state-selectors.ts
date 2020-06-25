import { StoreState } from "../store";
import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import { useSelector } from "react-redux";
import { LoadingStep } from "./loading-state-types";

export const getLoadingStateFromStore = (state: StoreState) =>
  getCurrentState(state.loadingState);

export const getLoadingStepFromStore = (state: StoreState) =>
  getLoadingStateFromStore(state).step;

export const useLoadingStep = (): LoadingStep =>
  useSelector(getLoadingStepFromStore);
