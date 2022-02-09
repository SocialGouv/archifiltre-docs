import { getIcicleSortMethodFromStore } from "@renderer/reducers/icicle-sort-method/icicle-sort-method-selectors";
import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "@renderer/reducers/icicle-sort-method/icicle-sort-method-types";

import { createEmptyStore } from "../store-test-utils";

const icicleSortMethod = {
  elementWeightMethod: ElementWeightMethod.BY_FILE_COUNT,
  icicleColorMode: IcicleColorMode.BY_TYPE,
  icicleSortMethod: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
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
