import { Record } from "immutable";
import * as RealEstate from "reducers/real-estate";

const State = Record({
  start: false,
  status: "",
  traverse_file_count: 0,
  finish: false
});

const property_name = "loading_state";

const initialState = () => new State();

const reader = {
  status: () => state => state.get("status"),
  count: () => state => state.get("traverse_file_count"),
  isStarted: () => state => state.get("start"),
  isFinished: () => state => state.get("finish")
};

const startToLoadFiles = () => state => {
  console.time("loaded");
  state = state.update("start", () => true);
  state = state.update("finish", () => false);
  return state;
};

const setStatus = a => state => state.set("status", a);
const setCount = a => state => state.set("traverse_file_count", a);

const finishedToLoadFiles = () => state => {
  console.timeEnd("loaded");
  state = state.update("start", () => true);
  state = state.update("finish", () => true);
  return state;
};

const reInit = () => state => initialState();

const writer = {
  startToLoadFiles,
  setStatus,
  setCount,
  finishedToLoadFiles,
  reInit
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
