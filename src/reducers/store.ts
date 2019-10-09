import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { UndoableState } from "./enhancers/undoable/undoable-types";
import filesAndFoldersReducer from "./files-and-folders/files-and-folders-reducer";
import { FilesAndFoldersState } from "./files-and-folders/files-and-folders-types";
import tagsReducer from "./tags/tags-reducer";
import { TagsState } from "./tags/tags-types";

export interface StoreState {
  tags: UndoableState<TagsState>;
  filesAndFolders: UndoableState<FilesAndFoldersState>;
}

export default createStore(
  combineReducers({
    filesAndFolders: filesAndFoldersReducer,
    tags: tagsReducer
  }),
  applyMiddleware(thunk)
);
