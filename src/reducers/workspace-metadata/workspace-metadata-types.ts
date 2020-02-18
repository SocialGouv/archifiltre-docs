export const SET_SESSION_NAME = "WORKSPACE_METADATA/SET_SESSION_NAME";
export const SET_ORIGINAL_PATH = "WORKSPACE_METADATA/SET_ORIGINAL_PATH";
export const SET_ICICLES_SORT_METHOD =
  "WORKSPACE_METADATA/SET_ICICLE_SORT_METHOD";
export const SET_HOVERED_ELEMENT_ID =
  "WORKSPACE_METADATA/SET_HOVERED_ELEMENT_ID";

export interface WorkspaceMetadataState {
  sessionName: string;
  originalPath: string;
  iciclesSortMethod: IciclesSortMethod;
  hoveredElementId: string;
}

export enum IciclesSortMethod {
  SORT_BY_TYPE,
  SORT_BY_DATE
}

interface SetSessionNameAction {
  type: typeof SET_SESSION_NAME;
  sessionName: string;
}

interface SetOriginalPathAction {
  type: typeof SET_ORIGINAL_PATH;
  originalPath: string;
}

interface SetIciclesSortMethod {
  type: typeof SET_ICICLES_SORT_METHOD;
  sortMethod: IciclesSortMethod;
}

interface SetHoveredElementId {
  type: typeof SET_HOVERED_ELEMENT_ID;
  hoveredElementId: string;
}

export type WorkspaceMetadataAction =
  | SetSessionNameAction
  | SetOriginalPathAction
  | SetIciclesSortMethod
  | SetHoveredElementId;
