export const SET_SESSION_NAME = "WORKSPACE_METADATA/SET_SESSION_NAME";
export const SET_ORIGINAL_PATH = "WORKSPACE_METADATA/SET_ORIGINAL_PATH";

export interface WorkspaceMetadataState {
  sessionName: string;
  originalPath: string;
}

interface SetSessionNameAction {
  type: typeof SET_SESSION_NAME;
  sessionName: string;
}

interface SetOriginalPathAction {
  type: typeof SET_ORIGINAL_PATH;
  originalPath: string;
}

export type WorkspaceMetadataAction =
  | SetSessionNameAction
  | SetOriginalPathAction;
