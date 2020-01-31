import {
  SET_ORIGINAL_PATH,
  SET_SESSION_NAME,
  WorkspaceMetadataAction
} from "./workspace-metadata-types";

export const setSessionName = (
  sessionName: string
): WorkspaceMetadataAction => ({
  sessionName,
  type: SET_SESSION_NAME
});

export const setOriginalPath = (
  originalPath: string
): WorkspaceMetadataAction => ({
  originalPath,
  type: SET_ORIGINAL_PATH
});
