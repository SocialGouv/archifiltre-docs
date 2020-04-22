import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { ArchifiltreThunkAction } from "../archifiltre-types";
import {
  setIciclesSortMethod,
  setSessionName,
} from "./workspace-metadata-actions";
import { IciclesSortMethod } from "./workspace-metadata-types";

/**
 * Set the session name.
 * @param sessionName
 * @param api - The old api. Used for conditional committing. Will be removed when all data will be handled in the redux store.
 */
export const setSessionNameThunk = (
  sessionName: string,
  api: any
): ArchifiltreThunkAction => (dispatch) => {
  if (sessionName.length > 0) {
    dispatch(setSessionName(sessionName));
    api.undo.commit();
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
