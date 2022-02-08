import type { StoreState } from "../store";
import { createEmptyStore } from "../store-test-utils";
import {
  createArchifiltreDocsError,
  getArchifiltreDocsErrors,
  getCompleteLoadingInfo,
  getLoadingInfoFromStore,
  getRunningLoadingInfo,
} from "./loading-info-selectors";
import { createLoadingInfo } from "./loading-info-test-utils";

const loadingLoadingInfoId = "loading-info-id";
const loadingLoadingInfo = createLoadingInfo({ id: loadingLoadingInfoId });
const completeLoadingInfoId = "completeLoadingInfo";
const completeLoadingInfo = createLoadingInfo({ id: completeLoadingInfoId });

const error = createArchifiltreDocsError({
  reason: "test-error",
});

const loadingInfoState = {
  complete: [completeLoadingInfoId],
  dismissed: [],
  errors: [error],
  loading: [loadingLoadingInfoId],
  loadingInfo: {
    [completeLoadingInfoId]: completeLoadingInfo,
    [loadingLoadingInfoId]: loadingLoadingInfo,
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

  describe("getArchifiltreDocsErrors", () => {
    it("should return the list of logged errors", () => {
      expect(getArchifiltreDocsErrors(testStore)).toEqual([error]);
    });
  });
});
