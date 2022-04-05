import {
  completeLoadingAction,
  dismissAllComplete,
  progressLoadingAction,
  registerErrorAction,
  resetLoadingAction,
  startLoadingAction,
  updateLoadingAction,
} from "@renderer/reducers/loading-info/loading-info-actions";
import {
  initialState,
  loadingInfoReducer,
} from "@renderer/reducers/loading-info/loading-info-reducer";
import { createArchifiltreDocsError } from "@renderer/reducers/loading-info/loading-info-selectors";
import type { LoadingInfoState } from "@renderer/reducers/loading-info/loading-info-types";

import { createLoadingInfo } from "./loading-info-test-utils";

const previouslyLoadingId = "prev-loading-id";
const previouslyLoading = createLoadingInfo({
  id: previouslyLoadingId,
});
const otherPreviouslyLoadingId = "other-prev-loading-id";
const otherPreviouslyLoading = createLoadingInfo({
  id: otherPreviouslyLoadingId,
});
const completeLoadingId = "complete-loading-id";
const completeLoading = createLoadingInfo({ id: completeLoadingId });

const baseState: LoadingInfoState = {
  complete: [completeLoadingId],
  dismissed: [],
  errors: [],
  loading: [previouslyLoadingId, otherPreviouslyLoadingId],
  loadingInfo: {
    [completeLoadingId]: completeLoading,
    [otherPreviouslyLoadingId]: otherPreviouslyLoading,
    [previouslyLoadingId]: previouslyLoading,
  },
};

describe("loading-info-reducer", () => {
  describe("START_LOADING", () => {
    it("should add the new loading to the state", () => {
      const newLoadingId = "new-loading-id";
      const newLoading = createLoadingInfo({
        id: newLoadingId,
        progress: 0,
      });

      expect(
        loadingInfoReducer(
          baseState,
          startLoadingAction(
            newLoadingId,
            newLoading.type,
            newLoading.goal,
            newLoading.label,
            newLoading.loadedLabel
          )
        )
      ).toEqual({
        ...baseState,
        loading: [previouslyLoadingId, otherPreviouslyLoadingId, newLoadingId],
        loadingInfo: {
          [completeLoadingId]: completeLoading,
          [newLoadingId]: newLoading,
          [otherPreviouslyLoadingId]: otherPreviouslyLoading,
          [previouslyLoadingId]: previouslyLoading,
        },
      });
    });
  });

  describe("UPDATE_LOADING", () => {
    it("should update the existing loading element", () => {
      const newProgress = 50;
      const newGoal = 150;

      expect(
        loadingInfoReducer(
          baseState,
          updateLoadingAction(previouslyLoadingId, newProgress, newGoal)
        )
      ).toEqual({
        ...baseState,
        loading: [previouslyLoadingId, otherPreviouslyLoadingId],
        loadingInfo: {
          [completeLoadingId]: completeLoading,
          [otherPreviouslyLoadingId]: otherPreviouslyLoading,
          [previouslyLoadingId]: {
            ...previouslyLoading,
            goal: newGoal,
            progress: newProgress,
          },
        },
      });
    });

    it("should update the existing loading element 2", () => {
      const progress = 50;

      expect(
        loadingInfoReducer(
          baseState,
          progressLoadingAction(previouslyLoadingId, progress)
        )
      ).toEqual({
        ...baseState,
        loading: [previouslyLoadingId, otherPreviouslyLoadingId],
        loadingInfo: {
          [completeLoadingId]: completeLoading,
          [otherPreviouslyLoadingId]: otherPreviouslyLoading,
          [previouslyLoadingId]: {
            ...previouslyLoading,
            progress: previouslyLoading.progress + progress,
          },
        },
      });
    });
  });

  describe("COMPLETE_LOADING", () => {
    it("should update the existing loading element", () => {
      expect(
        loadingInfoReducer(
          baseState,
          completeLoadingAction(previouslyLoadingId)
        )
      ).toEqual({
        ...baseState,
        complete: [completeLoadingId, previouslyLoadingId],
        loading: [otherPreviouslyLoadingId],
        loadingInfo: {
          [completeLoadingId]: completeLoading,
          [otherPreviouslyLoadingId]: otherPreviouslyLoading,
          [previouslyLoadingId]: previouslyLoading,
        },
      });
    });
  });

  describe("REGISTER_ERROR", () => {
    it("should add the error to the list", () => {
      const baseError = createArchifiltreDocsError({
        filePath: "/base",
      });
      const error = createArchifiltreDocsError({});
      const previousState = {
        ...baseState,
        errors: [baseError],
      };
      expect(
        loadingInfoReducer(previousState, registerErrorAction(error))
      ).toEqual({
        ...baseState,
        errors: [baseError, error],
      });
    });
  });

  describe("RESET_LOADING", () => {
    it("reset the whole state", () => {
      expect(loadingInfoReducer(baseState, resetLoadingAction())).toEqual(
        initialState
      );
    });
  });

  describe("DISMISS_ALL_COMPLETE", () => {
    it("should remove all the complete elements", () => {
      expect(loadingInfoReducer(baseState, dismissAllComplete())).toEqual({
        ...baseState,
        complete: [],
        dismissed: [completeLoadingId],
        loading: [previouslyLoadingId, otherPreviouslyLoadingId],
        loadingInfo: {
          [completeLoadingId]: completeLoading,
          [otherPreviouslyLoadingId]: otherPreviouslyLoading,
          [previouslyLoadingId]: previouslyLoading,
        },
      });
    });
  });
});
