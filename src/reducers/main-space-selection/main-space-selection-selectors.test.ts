import { createEmptyStore } from "reducers/store-test-utils";
import { MainSpaceSelectionState } from "reducers/main-space-selection/main-space-selection-types";
import { getMainSpaceSelectionFromStore } from "reducers/main-space-selection/main-space-selection-selectors";

const mainSpaceSelection: MainSpaceSelectionState = {
  zoomedElementId: "zoomed",
};

const store = {
  ...createEmptyStore(),
  mainSpaceSelection,
};

describe("main-space-selection-selectors", () => {
  describe("getMainSpaceSelectionFromStore", () => {
    it("should return the state from the store", () => {
      expect(getMainSpaceSelectionFromStore(store)).toEqual(mainSpaceSelection);
    });
  });
});
