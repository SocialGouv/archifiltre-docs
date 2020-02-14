import undoable from "../enhancers/undoable/undoable";
import {
  IciclesSortMethod,
  SET_ICICLES_SORT_METHOD,
  SET_ORIGINAL_PATH,
  SET_SESSION_NAME,
  WorkspaceMetadataAction,
  WorkspaceMetadataState
} from "./workspace-metadata-types";

const initialState: WorkspaceMetadataState = {
  iciclesSortMethod: IciclesSortMethod.SORT_BY_TYPE,
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
    case SET_ICICLES_SORT_METHOD:
      return { ...state, iciclesSortMethod: action.sortMethod };
    default:
      return state;
  }
};

export { workspaceMetadataReducer };

export default undoable(workspaceMetadataReducer, initialState);
