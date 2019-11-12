import * as ObjectUtil from "util/object-util.ts";
import * as RealEstate from "reducers/real-estate";

import store from "./store.ts";
import {
  commitAction,
  redoAction,
  undoAction
} from "./enhancers/undoable/undoable-actions";

const length_limit = 1000;

const initialState = s => {
  return {
    content: s,
    past: [],
    present: s,
    future: []
  };
};

const get = s => s.content;
const set = (a, s) => ObjectUtil.compose({ content: a }, s);

const hasAPast = () => state => state.past.length !== 0;
const hasAFuture = () => state => state.future.length !== 0;

const reader = {
  hasAPast,
  hasAFuture
};

const commit = () => state => {
  state = Object.assign({}, state);
  store.dispatch(commitAction());
  state.past = state.past.concat([state.present]);
  if (state.past.length > length_limit) {
    state.past = state.past.slice(1);
  }
  state.present = state.content;
  state.future = [];
  return state;
};

const undo = () => state => {
  state = Object.assign({}, state);
  store.dispatch(undoAction());
  if (hasAPast()(state)) {
    state.future = [state.present].concat(state.future);
    state.present = state.past.slice(-1)[0];
    state.past = state.past.slice(0, -1);
    state.content = state.present;
  }
  return state;
};

const redo = () => state => {
  state = Object.assign({}, state);
  store.dispatch(redoAction());
  if (hasAFuture()(state)) {
    state.past = state.past.concat([state.present]);
    state.present = state.future[0];
    state.future = state.future.slice(1);
    state.content = state.present;
  }
  return state;
};

const writer = {
  commit,
  undo,
  redo
};

export default RealEstate.createHigherOrder({
  initialState,
  get,
  set,
  reader,
  writer
});
