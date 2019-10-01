import { combineReducers, createStore } from "redux";
import tagsReducer from "./tags/tags-reducer";
import { TagsState } from "./tags/tags-types";

export interface StoreState {
  tags: TagsState;
}

export default createStore(
  combineReducers({
    tags: tagsReducer
  })
);
