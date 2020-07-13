import undoable from "../enhancers/undoable/undoable";
import {
  SET_HOVERED_ELEMENT_ID,
  SET_LOCKED_ELEMENT_ID,
  SET_ORIGINAL_PATH,
  SET_SESSION_NAME,
  WorkspaceMetadataAction,
  WorkspaceMetadataState,
} from "./workspace-metadata-types";

export const initialState: WorkspaceMetadataState = {
  hoveredElementId: "",
  lockedElementId: "",
  originalPath: "",
  sessionName: "",
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
    case SET_HOVERED_ELEMENT_ID:
      return { ...state, hoveredElementId: action.hoveredElementId };
    case SET_LOCKED_ELEMENT_ID:
      return { ...state, lockedElementId: action.lockedElementId };
    default:
      return state;
  }
};

export { workspaceMetadataReducer };

export default undoable(workspaceMetadataReducer, initialState);
