import {
  setHoveredElementId,
  setIciclesSortMethod,
  setLockedElementId,
  setOriginalPath,
  setSessionName,
} from "./workspace-metadata-actions";
import { workspaceMetadataReducer } from "./workspace-metadata-reducer";
import { IciclesSortMethod } from "./workspace-metadata-types";

const baseState = {
  hoveredElementId: "",
  iciclesSortMethod: IciclesSortMethod.SORT_BY_TYPE,
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

  it("should handle SET_ICICLE_SORT_METHOD", () => {
    const sortMethod = IciclesSortMethod.SORT_BY_DATE;
    const nextState = workspaceMetadataReducer(
      baseState,
      setIciclesSortMethod(sortMethod)
    );

    expect(nextState).toEqual({
      ...baseState,
      iciclesSortMethod: sortMethod,
    });
  });

  it("shoule handle SET_HOVERED_ELEMENT_ID", () => {
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
