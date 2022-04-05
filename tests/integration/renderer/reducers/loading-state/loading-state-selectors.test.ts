import { initialState } from "@renderer/reducers/loading-state/loading-state-reducer";
import {
  getLoadingStateFromStore,
  getLoadingStepFromStore,
} from "@renderer/reducers/loading-state/loading-state-selectors";
import { LoadingStep } from "@renderer/reducers/loading-state/loading-state-types";

import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";

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
