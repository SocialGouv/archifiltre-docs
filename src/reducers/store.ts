import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { UndoableState } from "./enhancers/undoable/undoable-types";
import filesAndFoldersMetadataReducer from "./files-and-folders-metadata/files-and-folders-metadata-reducer";
import { FilesAndFoldersMetadataState } from "./files-and-folders-metadata/files-and-folders-metadata-types";
import filesAndFoldersReducer from "./files-and-folders/files-and-folders-reducer";
import { FilesAndFoldersState } from "./files-and-folders/files-and-folders-types";
import tagsReducer from "./tags/tags-reducer";
import { TagsState } from "./tags/tags-types";

export interface StoreState {
  tags: UndoableState<TagsState>;
  filesAndFolders: UndoableState<FilesAndFoldersState>;
  filesAndFoldersMetadata: FilesAndFoldersMetadataState;
}

export default createStore(
  combineReducers({
    filesAndFolders: filesAndFoldersReducer,
    filesAndFoldersMetadata: filesAndFoldersMetadataReducer,
    tags: tagsReducer
  }),
  applyMiddleware(thunk)
);
