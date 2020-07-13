import mainspaceSelectionReducer, {
  initialState,
} from "reducers/main-space-selection/mainspace-selection-reducer";
import {
  resetZoom,
  zoomElement,
} from "reducers/main-space-selection/main-space-selection-action";

describe("main-space-selection-reducer", () => {
  it("ZOOM_ELEMENT", () => {
    const elementId = "test-id";
    const nextState = mainspaceSelectionReducer(
      initialState,
      zoomElement(elementId)
    );
    expect(nextState).toEqual({
      ...initialState,
      zoomedElementId: elementId,
    });
  });

  it("RESET_ZOOM", () => {
    const zoomedElementId = "test-id";
    const previousState = {
      ...initialState,
      zoomedElementId,
    };

    const nextState = mainspaceSelectionReducer(previousState, resetZoom());
    expect(nextState).toEqual({
      ...initialState,
    });
  });
});
