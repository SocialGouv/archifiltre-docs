import { initialState, loadingStateReducer } from "./loading-state-reducer";
import { setLoadingStep } from "./loading-state-actions";
import { LoadingStep } from "./loading-state-types";

describe("loading-state-reducer", () => {
  describe("SET_LOADING_STEP", () => {
    it("should update the loading step", () => {
      const nextStep = LoadingStep.FINISHED;
      const nextState = loadingStateReducer(
        initialState,
        setLoadingStep(nextStep)
      );

      expect(nextState).toEqual({
        ...initialState,
        step: nextStep,
      });
    });
  });
});
