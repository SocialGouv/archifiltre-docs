import { initialState } from "@renderer/reducers/hashes/hashes-reducer";
import { getHashesFromStore } from "@renderer/reducers/hashes/hashes-selectors";

import { createEmptyStore } from "../store-test-utils";

describe("hashes-selectors", () => {
  describe("getHashesFromStore", () => {
    it("should return the current store", () => {
      const fileId = "base-id";
      const hash = "hash";
      const emptyStore = createEmptyStore();
      const hashesMap = {
        [fileId]: hash,
      };
      const testStore = {
        ...emptyStore,
        hashes: {
          ...initialState,
          hashes: hashesMap,
        },
      };
      expect(getHashesFromStore(testStore)).toEqual(hashesMap);
    });
  });
});
