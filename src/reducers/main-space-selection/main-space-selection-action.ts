import {
  MainSpaceSelectionAction,
  RESET_ZOOM,
  ZOOM_ELEMENT,
} from "reducers/main-space-selection/main-space-selection-types";

/**
 * Action to zoom on an element
 * @param zoomedElementId
 */
export const zoomElement = (
  zoomedElementId: string
): MainSpaceSelectionAction => ({
  type: ZOOM_ELEMENT,
  zoomedElementId,
});

/**
 * Action to reset the zoom
 */
export const resetZoom = (): MainSpaceSelectionAction => ({
  type: RESET_ZOOM,
});
