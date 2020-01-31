import { setOriginalPath, setSessionName } from "./workspace-metadata-actions";
import { workspaceMetadataReducer } from "./workspace-metadata-reducer";

const baseState = {
  originalPath: "original-path",
  sessionName: "session"
};

describe("workspace-metadata-reducer", () => {
  it("should handle SET_SESSION_NAME", () => {
    const sessionName = "new-session-name";
    const nextState = workspaceMetadataReducer(
      baseState,
      setSessionName(sessionName)
    );

    expect(nextState).toEqual({
      originalPath: baseState.originalPath,
      sessionName
    });
  });

  it("should handle SET_ORIGINAL_PATH", () => {
    const originalPath = "new-original-path";
    const nextState = workspaceMetadataReducer(
      baseState,
      setOriginalPath(originalPath)
    );

    expect(nextState).toEqual({
      originalPath,
      sessionName: baseState.sessionName
    });
  });
});
