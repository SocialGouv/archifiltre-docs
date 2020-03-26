import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import { getWorkspaceMetadataFromStore } from "./workspace-metadata-selectors";
import {
  IciclesSortMethod,
  WorkspaceMetadataState
} from "./workspace-metadata-types";

const workspaceMetadata: WorkspaceMetadataState = {
  hoveredElementId: "",
  iciclesSortMethod: IciclesSortMethod.SORT_BY_DATE,
  lockedElementId: "",
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
});
