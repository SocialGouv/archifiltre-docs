import type { UndoableState } from "./enhancers/undoable/undoable-types";
import { initialState as filesAndFoldersInitialState } from "./files-and-folders/files-and-folders-reducer";
import { initialState as filesAndFoldersMetadataInitialState } from "./files-and-folders-metadata/files-and-folders-metadata-reducer";
import { initialState as hashesInitialState } from "./hashes/hashes-reducer";
import { initialState as icicleSortMethodInitialState } from "./icicle-sort-method/icicle-sort-method-reducer";
import { IcicleSortMethod } from "./icicle-sort-method/icicle-sort-method-types";
import { initialState as loadingInfoInitialState } from "./loading-info/loading-info-reducer";
import { initialState as loadingStateInitialState } from "./loading-state/loading-state-reducer";
import { initialState as modalInitialState } from "./modal/modal-reducer";
import type { StoreState } from "./store";

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
export const wrapStoreWithUndoable = <TState>(
  store: TState
): UndoableState<TState> => ({
  current: store,
  future: [],
  past: [],
  present: store,
});
