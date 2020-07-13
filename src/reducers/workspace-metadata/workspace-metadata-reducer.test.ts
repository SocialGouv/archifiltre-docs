import {
  setHoveredElementId,
  setLockedElementId,
  setOriginalPath,
  setSessionName,
} from "./workspace-metadata-actions";
import { workspaceMetadataReducer } from "./workspace-metadata-reducer";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";

const baseState = {
  hoveredElementId: "",
  iciclesSortMethod: IcicleSortMethod.SORT_BY_SIZE,
  lockedElementId: "",
  originalPath: "original-path",
  sessionName: "session",
};

describe("workspace-metadata-reducer", () => {
  it("should handle SET_SESSION_NAME", () => {
    const sessionName = "new-session-name";
    const nextState = workspaceMetadataReducer(
      baseState,
      setSessionName(sessionName)
    );

    expect(nextState).toEqual({
      ...baseState,
      sessionName,
    });
  });

  it("should handle SET_ORIGINAL_PATH", () => {
    const originalPath = "new-original-path";
    const nextState = workspaceMetadataReducer(
      baseState,
      setOriginalPath(originalPath)
    );

    expect(nextState).toEqual({
      ...baseState,
      originalPath,
    });
  });

  it("should handle SET_HOVERED_ELEMENT_ID", () => {
    const hoveredElementId = "hovered-id";

    const nextState = workspaceMetadataReducer(
      baseState,
      setHoveredElementId(hoveredElementId)
    );

    expect(nextState).toEqual({
      ...baseState,
      hoveredElementId,
    });
  });

  it("should handle SET_LOCKED_ELEMENT_ID", () => {
    const lockedElementId = "locked-id";
    const nextState = workspaceMetadataReducer(
      baseState,
      setLockedElementId(lockedElementId)
    );

    expect(nextState).toEqual({
      ...baseState,
      lockedElementId,
    });
  });
});
