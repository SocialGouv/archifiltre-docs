import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import {
  setElementWeightMethod,
  setIcicleColorMode,
  setIcicleSortMethod,
} from "./icicle-sort-method-actions";
import type {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "./icicle-sort-method-types";

/**
 * Defines the sort method of the icicles
 * @param iciclesSortMethod
 */
export const setIcicleSortMethodThunk =
  (iciclesSortMethod: IcicleSortMethod): ArchifiltreDocsThunkAction =>
  (dispatch) => {
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
export const setElementWeightMethodThunk =
  (elementWeightMethod: ElementWeightMethod): ArchifiltreDocsThunkAction =>
  (dispatch) => {
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
export const setIcicleColorModeThunk =
  (icicleColorMode: IcicleColorMode): ArchifiltreDocsThunkAction =>
  (dispatch) => {
    addTracker({
      title: ActionTitle.TOGGLE_ICICLES_COLOR,
      type: ActionType.TRACK_EVENT,
      value: icicleColorMode,
    });

    dispatch(setIcicleColorMode(icicleColorMode));
  };
