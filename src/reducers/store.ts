import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { UndoableState } from "./enhancers/undoable/undoable-types";
import tagsReducer from "./tags/tags-reducer";
import { TagsState } from "./tags/tags-types";

export interface StoreState {
  tags: UndoableState<TagsState>;
}

export default createStore(
  combineReducers({
    tags: tagsReducer
  }),
  applyMiddleware(thunk)
);
