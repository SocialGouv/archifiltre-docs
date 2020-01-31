import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import { getWorkspaceMetadataFromStore } from "./workspace-metadata-selectors";

const workspaceMetadata = {
  originalPath: "original-path",
  sessionName: "session-name"
};

const store = {
  ...createEmptyStore(),
  workspaceMetadata: wrapStoreWithUndoable(workspaceMetadata)
};

describe("workspace-metadata-selectors", () => {
  describe("getWorkspaceMetadataFromStore", () => {
    it("should retrieve the state from the store", () => {
      expect(getWorkspaceMetadataFromStore(store)).toEqual(workspaceMetadata);
    });
  });
});
