import {
  MainSpaceSelectionAction,
  MainSpaceSelectionState,
  RESET_ZOOM,
  ZOOM_ELEMENT,
} from "reducers/main-space-selection/main-space-selection-types";
import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";

export const initialState: MainSpaceSelectionState = {
  zoomedElementId: ROOT_FF_ID,
};

const mainspaceSelectionReducer = (
  state = initialState,
  action: MainSpaceSelectionAction
) => {
  switch (action.type) {
    case ZOOM_ELEMENT:
      return {
        ...state,
        zoomedElementId: action.zoomedElementId,
      };
    case RESET_ZOOM:
      return {
        ...state,
        zoomedElementId: ROOT_FF_ID,
      };
    default:
      return state;
  }
};

export default mainspaceSelectionReducer;
