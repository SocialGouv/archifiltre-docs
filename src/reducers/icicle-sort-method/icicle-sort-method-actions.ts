import {
  IcicleSortMethodAction,
  SET_ICICLE_SORT_METHOD,
  IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";

/**
 * Sets the sorting method of the icicles
 * @param sortMethod
 */
export const setIcicleSortMethod = (
  sortMethod: IcicleSortMethod
): IcicleSortMethodAction => ({
  sortMethod,
  type: SET_ICICLE_SORT_METHOD,
});
