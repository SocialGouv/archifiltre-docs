import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { UndoableState } from "./enhancers/undoable/undoable-types";
import filesAndFoldersMetadataReducer from "./files-and-folders-metadata/files-and-folders-metadata-reducer";
import { FilesAndFoldersMetadataState } from "./files-and-folders-metadata/files-and-folders-metadata-types";
import filesAndFoldersReducer from "./files-and-folders/files-and-folders-reducer";
import { FilesAndFoldersState } from "./files-and-folders/files-and-folders-types";
import loadingInfoReducer from "./loading-info/loading-info-reducer";
import { LoadingInfoState } from "./loading-info/loading-info-types";
import { persistActions } from "./middleware/persist-actions-middleware";
import tagsReducer from "./tags/tags-reducer";
import { TagsState } from "./tags/tags-types";
import workspaceMetadataReducer from "./workspace-metadata/workspace-metadata-reducer";
import { WorkspaceMetadataState } from "./workspace-metadata/workspace-metadata-types";
import { ModalState } from "./modal/modal-types";
import modalReducer from "./modal/modal-reducer";
import { LoadingState } from "./loading-state/loading-state-types";
import loadingStateReducer from "./loading-state/loading-state-reducer";
import { hashesReducer } from "./hashes/hashes-reducer";
import { HashesState } from "./hashes/hashes-types";
import { IcicleSortMethodState } from "reducers/icicle-sort-method/icicle-sort-method-types";
import icicleSortMethodReducer from "reducers/icicle-sort-method/icicle-sort-method-reducer";
import mainspaceSelectionReducer from "reducers/main-space-selection/mainspace-selection-reducer";
import { MainSpaceSelectionState } from "reducers/main-space-selection/main-space-selection-types";

export interface StoreState {
  tags: UndoableState<TagsState>;
  filesAndFolders: UndoableState<FilesAndFoldersState>;
  filesAndFoldersMetadata: FilesAndFoldersMetadataState;
  hashes: HashesState;
  icicleSortMethod: IcicleSortMethodState;
  loadingInfo: LoadingInfoState;
  loadingState: UndoableState<LoadingState>;
  mainSpaceSelection: MainSpaceSelectionState;
  modal: ModalState;
  workspaceMetadata: UndoableState<WorkspaceMetadataState>;
}

export default createStore(
  combineReducers({
    filesAndFolders: filesAndFoldersReducer,
    filesAndFoldersMetadata: filesAndFoldersMetadataReducer,
    hashes: hashesReducer,
    icicleSortMethod: icicleSortMethodReducer,
    loadingInfo: loadingInfoReducer,
    loadingState: loadingStateReducer,
    mainSpaceSelection: mainspaceSelectionReducer,
    modal: modalReducer,
    tags: tagsReducer,
    workspaceMetadata: workspaceMetadataReducer,
  }),
  applyMiddleware(thunk, persistActions)
);
