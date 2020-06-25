import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { ArchifiltreThunkAction } from "../archifiltre-types";
import {
  setIciclesSortMethod,
  setSessionName,
} from "./workspace-metadata-actions";
import { IciclesSortMethod } from "./workspace-metadata-types";
import { commitAction } from "../enhancers/undoable/undoable-actions";

/**
 * Set the session name.
 * @param sessionName
 */
export const setSessionNameThunk = (
  sessionName: string
): ArchifiltreThunkAction => (dispatch) => {
  if (sessionName.length > 0) {
    dispatch(setSessionName(sessionName));
    dispatch(commitAction());
  }
};

export const setIciclesSortMethodThunk = (
  iciclesSortMethod: IciclesSortMethod
): ArchifiltreThunkAction => (dispatch) => {
  addTracker({
    title: ActionTitle.TOGGLE_VIEW_BY_TYPE_DATES,
    type: ActionType.TRACK_EVENT,
  });

  dispatch(setIciclesSortMethod(iciclesSortMethod));
};
