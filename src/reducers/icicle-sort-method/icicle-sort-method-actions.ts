import {
  IcicleSortMethodAction,
  SET_ICICLE_SORT_METHOD,
  IcicleSortMethod,
  ElementWeightMethod,
  SET_ELEMENT_WEIGHT_METHOD,
  IcicleColorMode,
  SET_ICICLE_COLOR_MODE,
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

/**
 * Set the icicle size computation method
 * @param weightMethod
 */
export const setElementWeightMethod = (
  weightMethod: ElementWeightMethod
): IcicleSortMethodAction => ({
  type: SET_ELEMENT_WEIGHT_METHOD,
  weightMethod,
});

/**
 * Set the icicle color scheme
 * @param colorMode
 */
export const setIcicleColorMode = (
  colorMode: IcicleColorMode
): IcicleSortMethodAction => ({
  colorMode,
  type: SET_ICICLE_COLOR_MODE,
});
