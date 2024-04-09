import { getTrackerProvider } from "@common/modules/tracker";

import { type ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { setElementWeightMethod, setIcicleColorMode, setIcicleSortMethod } from "./icicle-sort-method-actions";
import { ElementWeightMethod, IcicleColorMode, IcicleSortMethod } from "./icicle-sort-method-types";

/**
 * Defines the sort method of the icicles
 * @param iciclesSortMethod
 */
export const setIcicleSortMethodThunk =
  (iciclesSortMethod: IcicleSortMethod): ArchifiltreDocsThunkAction =>
  dispatch => {
    getTrackerProvider().track("Feat(1.0) Nav Mode Changed", {
      navMode: "sort",
      type:
        iciclesSortMethod === IcicleSortMethod.SORT_ALPHA_NUMERICALLY
          ? "alpha"
          : iciclesSortMethod === IcicleSortMethod.SORT_BY_DATE
            ? "date"
            : "size",
    });

    dispatch(setIcicleSortMethod(iciclesSortMethod));
  };

/**
 * Defines the weight method of the icicles
 * @param elementWeightMethod
 */
export const setElementWeightMethodThunk =
  (elementWeightMethod: ElementWeightMethod): ArchifiltreDocsThunkAction =>
  dispatch => {
    getTrackerProvider().track("Feat(1.0) Nav Mode Changed", {
      navMode: "weight",
      type: elementWeightMethod === ElementWeightMethod.BY_FILE_COUNT ? "count" : "size",
    });

    dispatch(setElementWeightMethod(elementWeightMethod));
  };

/**
 * Defines the color mode of the icicles
 * @param icicleColorMode
 */
export const setIcicleColorModeThunk =
  (icicleColorMode: IcicleColorMode): ArchifiltreDocsThunkAction =>
  dispatch => {
    getTrackerProvider().track("Feat(1.0) Nav Mode Changed", {
      navMode: "color",
      type: icicleColorMode === IcicleColorMode.BY_DATE ? "date" : "type",
    });

    dispatch(setIcicleColorMode(icicleColorMode));
  };
