import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { commitAction } from "../enhancers/undoable/undoable-actions";
import { setSessionName } from "./workspace-metadata-actions";

/**
 * Set the session name.
 * @param sessionName
 */
export const setSessionNameThunk =
  (sessionName: string): ArchifiltreDocsThunkAction =>
  (dispatch) => {
    if (sessionName.length > 0) {
      dispatch(setSessionName(sessionName));
      dispatch(commitAction());
    }
  };
