import type { HashesState } from "@common/utils/hashes-types";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import type { UndoableState } from "./enhancers/undoable/undoable-types";
import { undoableFilesAndFoldersReducer as filesAndFoldersReducer } from "./files-and-folders/files-and-folders-reducer";
import type { FilesAndFoldersState } from "./files-and-folders/files-and-folders-types";
import { undoableFilesAndFoldersMetadataReducer as filesAndFoldersMetadataReducer } from "./files-and-folders-metadata/files-and-folders-metadata-reducer";
import type { FilesAndFoldersMetadataState } from "./files-and-folders-metadata/files-and-folders-metadata-types";
import { hashesReducer } from "./hashes/hashes-reducer";
import { icicleSortMethodReducer } from "./icicle-sort-method/icicle-sort-method-reducer";
import type { IcicleSortMethodState } from "./icicle-sort-method/icicle-sort-method-types";
import { loadingInfoReducer } from "./loading-info/loading-info-reducer";
import type { LoadingInfoState } from "./loading-info/loading-info-types";
import { undoableLoadingStateReducer as loadingStateReducer } from "./loading-state/loading-state-reducer";
import type { LoadingState } from "./loading-state/loading-state-types";
import { metadataReducer } from "./metadata/metadata-reducer";
import type { MetadataState } from "./metadata/metadata-types";
import { persistActions } from "./middleware/persist-actions-middleware";
import { modalReducer } from "./modal/modal-reducer";
import type { ModalState } from "./modal/modal-types";
import { sedaConfigurationReducer } from "./seda-configuration/seda-configuration-reducer";
import type { SedaConfigurationState } from "./seda-configuration/seda-configuration-type";
import { undoableTagsReducer as tagsReducer } from "./tags/tags-reducer";
import type { TagsState } from "./tags/tags-types";
import { undoableWorkspaceMetadataReducer as workspaceMetadataReducer } from "./workspace-metadata/workspace-metadata-reducer";
import type { WorkspaceMetadataState } from "./workspace-metadata/workspace-metadata-types";

export interface StoreState {
  filesAndFolders: UndoableState<FilesAndFoldersState>;
  filesAndFoldersMetadata: UndoableState<FilesAndFoldersMetadataState>;
  hashes: HashesState;
  icicleSortMethod: IcicleSortMethodState;
  loadingInfo: LoadingInfoState;
  loadingState: UndoableState<LoadingState>;
  metadata: UndoableState<MetadataState>;
  modal: ModalState;
  sedaConfiguration: SedaConfigurationState;
  tags: UndoableState<TagsState>;
  workspaceMetadata: UndoableState<WorkspaceMetadataState>;
}

export const store = createStore(
  combineReducers({
    filesAndFolders: filesAndFoldersReducer,
    filesAndFoldersMetadata: filesAndFoldersMetadataReducer,
    hashes: hashesReducer,
    icicleSortMethod: icicleSortMethodReducer,
    loadingInfo: loadingInfoReducer,
    loadingState: loadingStateReducer,
    metadata: metadataReducer,
    modal: modalReducer,
    sedaConfiguration: sedaConfigurationReducer,
    tags: tagsReducer,
    workspaceMetadata: workspaceMetadataReducer,
  }),
  applyMiddleware(thunk, persistActions)
);
