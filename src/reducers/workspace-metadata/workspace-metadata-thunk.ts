import { ArchifiltreThunkAction } from "../archifiltre-types";
import { setSessionName } from "./workspace-metadata-actions";
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
