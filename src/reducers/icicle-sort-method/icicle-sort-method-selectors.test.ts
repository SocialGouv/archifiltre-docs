import { createEmptyStore } from "reducers/store-test-utils";
import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";
import { getIcicleSortMethodFromStore } from "reducers/icicle-sort-method/icicle-sort-method-selectors";

const icicleSortMethod = {
  icicleSortMethod: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
  icicleColorMode: IcicleColorMode.BY_TYPE,
  elementWeightMethod: ElementWeightMethod.BY_FILE_COUNT,
};

const store = {
  ...createEmptyStore(),
  icicleSortMethod,
};

describe("icicle-sort-method-selectors", () => {
  describe("getIcicleSortMethodFromStore", () => {
    it("should return the icicleSortMethod value from the store", () => {
      expect(getIcicleSortMethodFromStore(store)).toEqual(icicleSortMethod);
    });
  });
});
