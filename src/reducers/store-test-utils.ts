import { UndoableState } from "./enhancers/undoable/undoable-types";
import { initialState as loadingInfoInitialState } from "./loading-info/loading-info-reducer";
import { initialState as modalInitialState } from "./modal/modal-reducer";
import { StoreState } from "./store";
import { initialState as loadingStateInitialState } from "./loading-state/loading-state-reducer";
import { initialState as hashesInitialState } from "./hashes/hashes-reducer";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { initialState as icicleSortMethodInitialState } from "reducers/icicle-sort-method/icicle-sort-method-reducer";
import { initialState as mainSpaceSelectionInitialState } from "reducers/main-space-selection/mainspace-selection-reducer";
import { initialState as filesAndFoldersMetadataInitialState } from "reducers/files-and-folders-metadata/files-and-folders-metadata-reducer";
import { initialState as filesAndFoldersInitialState } from "reducers/files-and-folders/files-and-folders-reducer";

/**
 * Create an empty store state for testing purposes
 */
export const createEmptyStore = (): StoreState => ({
  filesAndFolders: wrapStoreWithUndoable(filesAndFoldersInitialState),
  filesAndFoldersMetadata: wrapStoreWithUndoable(
    filesAndFoldersMetadataInitialState
  ),
  hashes: hashesInitialState,
  icicleSortMethod: icicleSortMethodInitialState,
  loadingInfo: loadingInfoInitialState,
  loadingState: wrapStoreWithUndoable(loadingStateInitialState),
  mainSpaceSelection: mainSpaceSelectionInitialState,
  modal: modalInitialState,
  tags: wrapStoreWithUndoable({
    tags: {},
  }),
  workspaceMetadata: wrapStoreWithUndoable({
    hoveredElementId: "",
    iciclesSortMethod: IcicleSortMethod.SORT_BY_SIZE,
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
