import { UndoableState } from "./enhancers/undoable/undoable-types";
import { initialState as loadingInfoInitialState } from "./loading-info/loading-info-reducer";
import { StoreState } from "./store";

/**
 * Create an empty store state for testing purposes
 */
export const createEmptyStore = (): StoreState => ({
  filesAndFolders: wrapStoreWithUndoable({
    filesAndFolders: {},
    hashes: {}
  }),
  filesAndFoldersMetadata: {
    filesAndFoldersMetadata: {}
  },
  loadingInfo: loadingInfoInitialState,
  tags: wrapStoreWithUndoable({
    tags: {}
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
