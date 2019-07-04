import { Record } from "immutable";
import * as RealEstate from "reducers/real-estate";

const State = Record({
  start: false,
  status: "",
  traverse_file_count: 0,
  total_count: 0,
  finish: false,
  error: false
});

const property_name = "loading_state";

const initialState = () => new State();

const reader = {
  status: () => state => state.get("status"),
  count: () => state => state.get("traverse_file_count"),
  totalCount: () => state => state.get("total_count"),
  isStarted: () => state => state.get("start"),
  isFinished: () => state => state.get("finish"),
  isInError: () => state => state.get("error")
};

const startToLoadFiles = () => state => {
  console.time("loaded");
  return state
    .update("start", () => true)
    .update("finish", () => false)
    .update("error", () => false);
};

const setStatus = a => state => state.set("status", a);
const setCount = a => state => state.set("traverse_file_count", a);
const setTotalCount = a => state => state.set("total_count", a);

const finishedToLoadFiles = () => state => {
  console.timeEnd("loaded");
  return state
    .update("start", () => true)
    .update("finish", () => true)
    .update("error", () => false);
};

const errorLoadingFiles = () => state => {
  console.log("errorLoadingFiles");
  return state
    .update("start", () => true)
    .update("finish", () => true)
    .update("error", () => true);
};

const reInit = () => state => initialState();

const writer = {
  startToLoadFiles,
  setStatus,
  setCount,
  setTotalCount,
  finishedToLoadFiles,
  errorLoadingFiles,
  reInit
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
