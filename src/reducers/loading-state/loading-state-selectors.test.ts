import { initialState } from "./loading-state-reducer";
import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  getLoadingStateFromStore,
  getLoadingStepFromStore,
} from "./loading-state-selectors";
import { LoadingStep } from "./loading-state-types";

describe("loading-state-selectors", () => {
  describe("getLoadingStateFromStore", () => {
    it("should return the loadingState", () => {
      const loadingState = initialState;

      const store = {
        ...createEmptyStore(),
        loadingState: wrapStoreWithUndoable(loadingState),
      };

      expect(getLoadingStateFromStore(store)).toEqual(loadingState);
    });
  });

  describe("getLoadingStepFromStore", () => {
    it("should return the loadingState", () => {
      const step = LoadingStep.FINISHED;
      const loadingState = {
        ...initialState,
        step,
      };

      const store = {
        ...createEmptyStore(),
        loadingState: wrapStoreWithUndoable(loadingState),
      };

      expect(getLoadingStepFromStore(store)).toEqual(step);
    });
  });
});
