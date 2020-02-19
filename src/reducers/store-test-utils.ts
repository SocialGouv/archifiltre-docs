import { UndoableState } from "./enhancers/undoable/undoable-types";
import { initialState as loadingInfoInitialState } from "./loading-info/loading-info-reducer";
import { StoreState } from "./store";
import { IciclesSortMethod } from "./workspace-metadata/workspace-metadata-types";

/**
 * Create an empty store state for testing purposes
 */
export const createEmptyStore = (): StoreState => ({
  filesAndFolders: wrapStoreWithUndoable({
    aliases: {},
    comments: {},
    elementsToDelete: [],
    filesAndFolders: {},
    hashes: {},
    virtualPathToId: {}
  }),
  filesAndFoldersMetadata: {
    filesAndFoldersMetadata: {}
  },
  loadingInfo: loadingInfoInitialState,
  tags: wrapStoreWithUndoable({
    tags: {}
  }),
  workspaceMetadata: wrapStoreWithUndoable({
    hoveredElementId: "",
    iciclesSortMethod: IciclesSortMethod.SORT_BY_TYPE,
    lockedElementId: "",
    originalPath: "",
    sessionName: ""
  })
});

/**
 * Test utility to create states wrapped with undoable
 * @param store - the store to wrap with undoable
 */
export const wrapStoreWithUndoable = <State>(
  store: State
): UndoableState<State> => ({
  current: store,
  future: [],
  past: [],
  present: store
});
