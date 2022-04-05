export const SET_SESSION_NAME = "WORKSPACE_METADATA/SET_SESSION_NAME";
export const SET_ORIGINAL_PATH = "WORKSPACE_METADATA/SET_ORIGINAL_PATH";
export const SET_HOVERED_ELEMENT_ID =
  "WORKSPACE_METADATA/SET_HOVERED_ELEMENT_ID";
export const SET_LOCKED_ELEMENT_ID = "WORKSPACE_METADATA/SET_LOCKED_ELEMENT_ID";

export interface WorkspaceMetadataState {
  hoveredElementId: string;
  lockedElementId: string;
  originalPath: string;
  sessionName: string;
}

interface SetSessionNameAction {
  sessionName: string;
  type: typeof SET_SESSION_NAME;
}

interface SetOriginalPathAction {
  originalPath: string;
  type: typeof SET_ORIGINAL_PATH;
}

interface SetHoveredElementId {
  hoveredElementId: string;
  type: typeof SET_HOVERED_ELEMENT_ID;
}

interface SetLockedElementId {
  lockedElementId: string;
  type: typeof SET_LOCKED_ELEMENT_ID;
}

export type WorkspaceMetadataAction =
  | SetHoveredElementId
  | SetLockedElementId
  | SetOriginalPathAction
  | SetSessionNameAction;
