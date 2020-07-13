export const ZOOM_ELEMENT = "main-space-selection/zoom-element";
export const RESET_ZOOM = "main-space-selection/reset-zoom";

export type MainSpaceSelectionState = {
  zoomedElementId: string;
};

type ZoomElementAction = {
  type: typeof ZOOM_ELEMENT;
  zoomedElementId: string;
};

type ResetZoom = {
  type: typeof RESET_ZOOM;
};

export type MainSpaceSelectionAction = ZoomElementAction | ResetZoom;
