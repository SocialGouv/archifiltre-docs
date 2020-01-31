import undoable from "../enhancers/undoable/undoable";
import {
  SET_ORIGINAL_PATH,
  SET_SESSION_NAME,
  WorkspaceMetadataAction,
  WorkspaceMetadataState
} from "./workspace-metadata-types";

const initialState: WorkspaceMetadataState = {
  originalPath: "",
  sessionName: ""
};

const workspaceMetadataReducer = (
  state = initialState,
  action: WorkspaceMetadataAction
) => {
  switch (action.type) {
    case SET_SESSION_NAME:
      return { ...state, sessionName: action.sessionName };
    case SET_ORIGINAL_PATH:
      return { ...state, originalPath: action.originalPath };
    default:
      return state;
  }
};

export { workspaceMetadataReducer };

export default undoable(workspaceMetadataReducer, initialState);
