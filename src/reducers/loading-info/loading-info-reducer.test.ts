import {
    completeLoadingAction,
    dismissAllComplete,
    progressLoadingAction,
    registerErrorAction,
    resetLoadingAction,
    startLoadingAction,
    updateLoadingAction,
} from "./loading-info-actions";
import loadingInfoReducer, { initialState } from "./loading-info-reducer";
import { createArchifiltreError } from "./loading-info-selectors";
import { createLoadingInfo } from "./loading-info-test-utils";
import type { LoadingInfoState } from "./loading-info-types";

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
                loading: [
                    previouslyLoadingId,
                    otherPreviouslyLoadingId,
                    newLoadingId,
                ],
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
                    updateLoadingAction(
                        previouslyLoadingId,
                        newProgress,
                        newGoal
                    )
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
    });

    describe("UPDATE_LOADING", () => {
        it("should update the existing loading element", () => {
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
            const baseError = createArchifiltreError({
                filePath: "/base",
            });
            const error = createArchifiltreError({});
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
            expect(loadingInfoReducer(baseState, dismissAllComplete())).toEqual(
                {
                    ...baseState,
                    complete: [],
                    dismissed: [completeLoadingId],
                    loading: [previouslyLoadingId, otherPreviouslyLoadingId],
                    loadingInfo: {
                        [completeLoadingId]: completeLoading,
                        [otherPreviouslyLoadingId]: otherPreviouslyLoading,
                        [previouslyLoadingId]: previouslyLoading,
                    },
                }
            );
        });
    });
});
