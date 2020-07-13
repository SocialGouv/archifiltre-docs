import { createEmptyStore } from "reducers/store-test-utils";
import { initialState } from "reducers/icicle-sort-method/icicle-sort-method-reducer";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { getIcicleSortMethodFromStore } from "reducers/icicle-sort-method/icicle-sort-method-selectors";

const store = {
  ...createEmptyStore(),
  icicleSortMethod: {
    ...initialState,
    icicleSortMethod: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
  },
};

describe("icicle-sort-method-selectors", () => {
  describe("", () => {
    it("should return the icicleSortMethod value from the store", () => {
      expect(getIcicleSortMethodFromStore(store)).toEqual(
        IcicleSortMethod.SORT_ALPHA_NUMERICALLY
      );
    });
  });
});
