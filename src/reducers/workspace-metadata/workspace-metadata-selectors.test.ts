import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  getHoveredElementIdFromStore,
  getSessionNameFromStore,
  getLockedElementIdFromStore,
  getOriginalPathFromStore,
  getWorkspaceMetadataFromStore,
} from "./workspace-metadata-selectors";
import { WorkspaceMetadataState } from "./workspace-metadata-types";

const workspaceMetadata: WorkspaceMetadataState = {
  hoveredElementId: "hover",
  lockedElementId: "locked",
  originalPath: "original-path",
  sessionName: "session-name",
};

const store = {
  ...createEmptyStore(),
  workspaceMetadata: wrapStoreWithUndoable(workspaceMetadata),
};

describe("workspace-metadata-selectors", () => {
  describe("getWorkspaceMetadataFromStore", () => {
    it("should retrieve the state from the store", () => {
      expect(getWorkspaceMetadataFromStore(store)).toEqual(workspaceMetadata);
    });
  });

  describe("getSessionNameFromStore", () => {
    it("should retrieve the session name from the store", () => {
      expect(getSessionNameFromStore(store)).toEqual("session-name");
    });
  });
  describe("getLockedElementIdFromStore", () => {
    it("should retrieve the locked element id from the store", () => {
      expect(getLockedElementIdFromStore(store)).toEqual("locked");
    });
  });
  describe("getHoveredElementIdFromStore", () => {
    it("should retrieve the hovered element id from the store", () => {
      expect(getHoveredElementIdFromStore(store)).toEqual("hover");
    });
  });
  describe("getOriginalPathFromStore", () => {
    it("should retrieve the original path from the store", () => {
      expect(getOriginalPathFromStore(store)).toEqual("original-path");
    });
  });
});
