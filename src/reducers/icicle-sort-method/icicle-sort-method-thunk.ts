import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import {
  setElementWeightMethod,
  setIcicleColorMode,
  setIcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-actions";

/**
 * Defines the sort method of the icicles
 * @param iciclesSortMethod
 */
export const setIcicleSortMethodThunk = (
  iciclesSortMethod: IcicleSortMethod
): ArchifiltreThunkAction => (dispatch) => {
  addTracker({
    title: ActionTitle.TOGGLE_ICICLES_SORT,
    type: ActionType.TRACK_EVENT,
    value: iciclesSortMethod,
  });

  dispatch(setIcicleSortMethod(iciclesSortMethod));
};

/**
 * Defines the weight method of the icicles
 * @param elementWeightMethod
 */
export const setElementWeightMethodThunk = (
  elementWeightMethod: ElementWeightMethod
): ArchifiltreThunkAction => (dispatch) => {
  addTracker({
    title: ActionTitle.TOGGLE_ICICLES_WEIGHT,
    type: ActionType.TRACK_EVENT,
    value: elementWeightMethod,
  });

  dispatch(setElementWeightMethod(elementWeightMethod));
};

/**
 * Defines the color mode of the icicles
 * @param icicleColorMode
 */
export const setIcicleColorModeThunk = (
  icicleColorMode: IcicleColorMode
): ArchifiltreThunkAction => (dispatch) => {
  addTracker({
    title: ActionTitle.TOGGLE_ICICLES_COLOR,
    type: ActionType.TRACK_EVENT,
    value: icicleColorMode,
  });

  dispatch(setIcicleColorMode(icicleColorMode));
};
