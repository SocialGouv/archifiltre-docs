import { useSelector } from "react-redux";

import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import type { StoreState } from "../store";
import type { LoadingStep } from "./loading-state-types";

export const getLoadingStateFromStore = (state: StoreState) =>
    getCurrentState(state.loadingState);

export const getLoadingStepFromStore = (state: StoreState) =>
    getLoadingStateFromStore(state).step;

export const useLoadingStep = (): LoadingStep =>
    useSelector(getLoadingStepFromStore);
