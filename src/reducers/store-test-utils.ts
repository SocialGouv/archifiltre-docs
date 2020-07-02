import { UndoableState } from "./enhancers/undoable/undoable-types";
import { initialState as loadingInfoInitialState } from "./loading-info/loading-info-reducer";
import { initialState as modalInitialState } from "./modal/modal-reducer";
import { StoreState } from "./store";
import { IciclesSortMethod } from "./workspace-metadata/workspace-metadata-types";
import { initialState as loadingStateInitialState } from "./loading-state/loading-state-reducer";
import { initialState as hashesInitialState } from "./hashes/hashes-reducer";

/**
 * Create an empty store state for testing purposes
 */
export const createEmptyStore = (): StoreState => ({
  filesAndFolders: wrapStoreWithUndoable({
    aliases: {},
    comments: {},
    elementsToDelete: [],
    filesAndFolders: {},
    virtualPathToId: {},
  }),
  filesAndFoldersMetadata: {
    filesAndFoldersMetadata: {},
  },
  hashes: hashesInitialState,
  loadingInfo: loadingInfoInitialState,
  loadingState: wrapStoreWithUndoable(loadingStateInitialState),
  modal: modalInitialState,
  tags: wrapStoreWithUndoable({
    tags: {},
  }),
  workspaceMetadata: wrapStoreWithUndoable({
    hoveredElementId: "",
    iciclesSortMethod: IciclesSortMethod.SORT_BY_TYPE,
    lockedElementId: "",
    originalPath: "",
    sessionName: "",
  }),
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
  present: store,
});
