import {
  IciclesSortMethod,
  SET_HOVERED_ELEMENT_ID,
  SET_ICICLES_SORT_METHOD,
  SET_ORIGINAL_PATH,
  SET_SESSION_NAME,
  WorkspaceMetadataAction,
} from "./workspace-metadata-types";

export const setSessionName = (
  sessionName: string
): WorkspaceMetadataAction => ({
  sessionName,
  type: SET_SESSION_NAME,
});

export const setOriginalPath = (
  originalPath: string
): WorkspaceMetadataAction => ({
  originalPath,
  type: SET_ORIGINAL_PATH,
});

/**
 * Sets the sorting method of the icicles
 * @param sortMethod
 */
export const setIciclesSortMethod = (
  sortMethod: IciclesSortMethod
): WorkspaceMetadataAction => ({
  sortMethod,
  type: SET_ICICLES_SORT_METHOD,
});

/**
 * Sets the hovered element ID in the workspace
 * @param hoveredElementId
 */
export const setHoveredElementId = (
  hoveredElementId: string
): WorkspaceMetadataAction => ({
  hoveredElementId,
  type: SET_HOVERED_ELEMENT_ID,
});
