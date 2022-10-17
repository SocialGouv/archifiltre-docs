import type { UndoableState } from "@renderer/reducers/enhancers/undoable/undoable-types";
import { initialState as filesAndFoldersInitialState } from "@renderer/reducers/files-and-folders/files-and-folders-reducer";
import { initialState as filesAndFoldersMetadataInitialState } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-reducer";
import { initialState as hashesInitialState } from "@renderer/reducers/hashes/hashes-reducer";
import { initialState as icicleSortMethodInitialState } from "@renderer/reducers/icicle-sort-method/icicle-sort-method-reducer";
import { IcicleSortMethod } from "@renderer/reducers/icicle-sort-method/icicle-sort-method-types";
import { initialState as loadingInfoInitialState } from "@renderer/reducers/loading-info/loading-info-reducer";
import { initialState as loadingStateInitialState } from "@renderer/reducers/loading-state/loading-state-reducer";
import { initialState as metadataInitialState } from "@renderer/reducers/metadata/metadata-reducer";
import { initialState as modalInitialState } from "@renderer/reducers/modal/modal-reducer";
import { initialState as sedaInitialState } from "@renderer/reducers/seda-configuration/seda-configuration-reducer";
import type { StoreState } from "@renderer/reducers/store";

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
  metadata: wrapStoreWithUndoable(metadataInitialState),
  modal: modalInitialState,
  sedaConfiguration: sedaInitialState,
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
