import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { UndoableState } from "./enhancers/undoable/undoable-types";
import filesAndFoldersMetadataReducer from "./files-and-folders-metadata/files-and-folders-metadata-reducer";
import { FilesAndFoldersMetadataState } from "./files-and-folders-metadata/files-and-folders-metadata-types";
import filesAndFoldersReducer from "./files-and-folders/files-and-folders-reducer";
import { FilesAndFoldersState } from "./files-and-folders/files-and-folders-types";
import loadingInfoReducer from "./loading-info/loading-info-reducer";
import { LoadingInfoState } from "./loading-info/loading-info-types";
import tagsReducer from "./tags/tags-reducer";
import { TagsState } from "./tags/tags-types";
import workspaceMetadataReducer from "./workspace-metadata/workspace-metadata-reducer";
import { WorkspaceMetadataState } from "./workspace-metadata/workspace-metadata-types";

export interface StoreState {
  tags: UndoableState<TagsState>;
  filesAndFolders: UndoableState<FilesAndFoldersState>;
  filesAndFoldersMetadata: FilesAndFoldersMetadataState;
  loadingInfo: LoadingInfoState;
  workspaceMetadata: UndoableState<WorkspaceMetadataState>;
}

export default createStore(
  combineReducers({
    filesAndFolders: filesAndFoldersReducer,
    filesAndFoldersMetadata: filesAndFoldersMetadataReducer,
    loadingInfo: loadingInfoReducer,
    tags: tagsReducer,
    workspaceMetadata: workspaceMetadataReducer
  }),
  applyMiddleware(thunk)
);
