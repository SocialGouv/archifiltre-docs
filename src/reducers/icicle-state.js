import { Record } from "immutable";
import * as RealEstate from "reducers/real-estate";
import { addTracker } from "../logging/tracker";
import { ActionTitle, ActionType } from "../logging/tracker-types";

const State = Record({
  hover_seq: [],
  lock_seq: [],
  dims: {},
  tag_id_to_highlight: "",
  display_root: [],
  change_skin: false,
  width_by_size: true
});

const property_name = "icicle_state";

const initialState = () => new State();

const hover_sequence = () => state => state.get("hover_seq");
const lock_sequence = () => state => state.get("lock_seq");

const isLocked = () => state => state.get("lock_seq").length > 0;

const sequence = () => state => {
  let sequence;
  if (isLocked()(state)) {
    sequence = lock_sequence()(state);
  } else {
    sequence = hover_sequence()(state);
  }

  return sequence;
};

const reader = {
  hover_sequence,
  lock_sequence,
  sequence,
  hover_dims: () => state => state.get("dims"),
  tagIdToHighlight: () => state => state.get("tag_id_to_highlight"),
  display_root: () => state => state.get("display_root"),
  isFocused: () => state => state.get("hover_seq").length > 0,
  isLocked,
  isZoomed: () => state => state.get("display_root").length > 0,
  changeSkin: () => state => state.get("change_skin"),
  widthBySize: () => state => state.get("width_by_size")
};

const setNoHover = () => state => state.update("hover_seq", () => []);

const setFocus = (id_arr, dims) => state => {
  state = state.update("hover_seq", () => id_arr);
  if (!isLocked()(state)) state = state.update("dims", () => dims);
  return state;
};

const setNoFocus = () => state => {
  state = state.update("hover_seq", () => []);
  state = state.update("dims", () => {
    return {};
  });
  return state;
};

const lock = (id_arr, dims) => state => {
  state = state.update("lock_seq", () => id_arr);
  state = state.update("dims", () => dims);
  return state;
};

const unlock = () => state => {
  state = state.update("lock_seq", () => []);
  return state;
};

const setDisplayRoot = root_seq => state => {
  state = state.update("display_root", () => root_seq);
  state = state.update("lock_seq", () => []);
  clearSelection();
  return state;
};

const setNoDisplayRoot = () => state => {
  state = state.update("display_root", () => []);
  state = state.update("lock_seq", () => []);
  clearSelection();
  return state;
};

const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

const setTagIdToHighlight = tag => state => {
  state = state.update("tag_id_to_highlight", () => tag);
  return state;
};

const setNoTagIdToHighlight = () => state => {
  state = state.update("tag_id_to_highlight", () => "");
  return state;
};

const toggleChangeSkin = () => state => {
  addTracker({
    title: ActionTitle.TOGGLE_VIEW_BY_TYPE_DATES,
    type: ActionType.TRACK_EVENT
  });
  state = state.update("change_skin", a => !a);
  return state;
};

const toggleChangeWidthBySize = () => state => {
  addTracker({
    title: ActionTitle.TOGGLE_VIEW_BY_VOLUME_NUMBER,
    type: ActionType.TRACK_EVENT
  });
  state = state.update("width_by_size", a => !a);
  state = state.update("dims", () => {
    return {};
  });
  return state;
};

const reInit = () => () => initialState();

const writer = {
  setNoHover,
  setFocus,
  setNoFocus,
  lock,
  unlock,
  setDisplayRoot,
  setNoDisplayRoot,
  setTagIdToHighlight,
  setNoTagIdToHighlight,
  toggleChangeSkin,
  toggleChangeWidthBySize,
  reInit
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
