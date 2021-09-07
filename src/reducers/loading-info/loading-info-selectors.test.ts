import { StoreState } from "../store";
import { createEmptyStore } from "../store-test-utils";
import {
  createArchifiltreError,
  getArchifiltreErrors,
  getCompleteLoadingInfo,
  getLoadingInfoFromStore,
  getRunningLoadingInfo,
} from "./loading-info-selectors";
import { createLoadingInfo } from "./loading-info-test-utils";
import { CompleteLoadingAction, LoadingInfoState } from "./loading-info-types";

const loadingLoadingInfoId = "loading-info-id";
const loadingLoadingInfo = createLoadingInfo({ id: loadingLoadingInfoId });
const completeLoadingInfoId = "completeLoadingInfo";
const completeLoadingInfo = {
  ...createLoadingInfo({ id: completeLoadingInfoId }),
  onClickComplete: jest.fn(),
};

const error = createArchifiltreError({
  reason: "test-error",
});

const loadingInfoState: LoadingInfoState = {
  complete: [(completeLoadingInfo as unknown) as CompleteLoadingAction],
  dismissed: [],
  errors: [error],
  loading: [loadingLoadingInfoId],
  loadingInfo: {
    [loadingLoadingInfoId]: loadingLoadingInfo,
    [completeLoadingInfoId]: completeLoadingInfo,
  },
};

const testStore: StoreState = {
  ...createEmptyStore(),
  loadingInfo: loadingInfoState,
};

describe("loading-info-selectors", () => {
  describe("getLoadingInfoFromStore", () => {
    it("should return the loading info state", () => {
      expect(getLoadingInfoFromStore(testStore)).toEqual(loadingInfoState);
    });
  });

  describe("getRunningLoadingInfo", () => {
    it("should return the currently running loading info", () => {
      expect(getRunningLoadingInfo(loadingInfoState)).toEqual([
        loadingLoadingInfo,
      ]);
    });
  });

  describe("getCompleteLoadingInfo", () => {
    it("should return the currently running loading info", () => {
      expect(getCompleteLoadingInfo(loadingInfoState)).toEqual([
        completeLoadingInfo,
      ]);
    });
  });

  describe("getArchifiltreErrors", () => {
    it("should return the list of logged errors", () => {
      expect(getArchifiltreErrors(testStore)).toEqual([error]);
    });
  });
});
