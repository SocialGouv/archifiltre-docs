import { UndoableState } from "./enhancers/undoable/undoable-types";
import { StoreState } from "./store";

/**
 * Create an empty store state for testing purposes
 */
export const createEmptyStore = (): StoreState => ({
  filesAndFolders: wrapStoreWithUndoable({
    filesAndFolders: {}
  }),
  filesAndFoldersMetadata: {
    filesAndFoldersMetadata: {}
  },
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
