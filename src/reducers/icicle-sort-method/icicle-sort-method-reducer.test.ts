import icicleSortMethodReducer, {
  initialState,
} from "reducers/icicle-sort-method/icicle-sort-method-reducer";
import { setIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-actions";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";

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
});
