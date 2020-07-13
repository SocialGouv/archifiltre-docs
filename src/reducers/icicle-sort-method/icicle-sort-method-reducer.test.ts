import icicleSortMethodReducer, {
  initialState,
} from "reducers/icicle-sort-method/icicle-sort-method-reducer";
import {
  setElementWeightMethod,
  setIcicleColorMode,
  setIcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-actions";
import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";

describe("icicleSortMethodReducer", () => {
  describe("SET_ICICLE_SORT_METHOD", () => {
    it("should change the sortMethod", () => {
      expect(
        icicleSortMethodReducer(
          initialState,
          setIcicleSortMethod(IcicleSortMethod.SORT_ALPHA_NUMERICALLY)
        )
      ).toEqual({
        ...initialState,
        icicleSortMethod: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
      });
    });
  });

  describe("SET_ELEMENT_WEIGHT_METHOD", () => {
    it("should change the sortMethod", () => {
      expect(
        icicleSortMethodReducer(
          initialState,
          setElementWeightMethod(ElementWeightMethod.BY_FILE_COUNT)
        )
      ).toEqual({
        ...initialState,
        elementWeightMethod: ElementWeightMethod.BY_FILE_COUNT,
      });
    });
  });

  describe("SET_ICICLE_COLOR_MODE", () => {
    it("should change the sortMethod", () => {
      expect(
        icicleSortMethodReducer(
          initialState,
          setIcicleColorMode(IcicleColorMode.BY_DATE)
        )
      ).toEqual({
        ...initialState,
        icicleColorMode: IcicleColorMode.BY_DATE,
      });
    });
  });
});
