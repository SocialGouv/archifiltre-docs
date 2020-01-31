import { ArchifiltreThunkAction } from "../archifiltre-types";
import { setSessionName } from "./workspace-metadata-actions";

/**
 * Set the session name.
 * @param sessionName
 * @param api - The old api. Used for conditional committing. Will be removed when all data will be handled in the redux store.
 */
export const setSessionNameThunk = (
  sessionName: string,
  api: any
): ArchifiltreThunkAction => dispatch => {
  if (sessionName.length > 0) {
    dispatch(setSessionName(sessionName));
    api.undo.commit();
  }
};
