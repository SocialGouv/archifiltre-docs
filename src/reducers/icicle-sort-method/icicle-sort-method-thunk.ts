import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { setIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-actions";

/**
 * Defines the sort method of the icicles
 * @param iciclesSortMethod
 */
export const setIcicleSortMethodThunk = (
  iciclesSortMethod: IcicleSortMethod
): ArchifiltreThunkAction => (dispatch) => {
  addTracker({
    title: ActionTitle.TOGGLE_VIEW_BY_TYPE_DATES,
    type: ActionType.TRACK_EVENT,
  });

  dispatch(setIcicleSortMethod(iciclesSortMethod));
};
