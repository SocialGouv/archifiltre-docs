import { Record } from "immutable";
import * as RealEstate from "reducers/real-estate";

const State = Record({
  start: false,
  status: "",
  traverse_file_count: 0,
  total_count: 0,
  finish: false,
  error: false,
});

const propertyName = "loading_state";

const initialState = () => new State();

const reader = {
  status: () => (state) => state.get("status"),
  count: () => (state) => state.get("traverse_file_count"),
  totalCount: () => (state) => state.get("total_count"),
};

const setStatus = (a) => (state) => state.set("status", a);
const setCount = (a) => (state) => state.set("traverse_file_count", a);
const setTotalCount = (a) => (state) => state.set("total_count", a);

const reInit = () => () => initialState();

const writer = {
  setStatus,
  setCount,
  setTotalCount,
  reInit,
};

export default RealEstate.create({
  property_name: propertyName,
  initialState,
  reader,
  writer,
});
