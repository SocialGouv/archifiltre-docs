import { Record } from "immutable";
import * as RealEstate from "reducers/real-estate";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";

declare global {
  interface Document {
    selection: any;
  }
}

const State = Record({
  tag_id_to_highlight: "",
  display_root: [],
  width_by_size: true,
});

const propertyName = "icicle_state";

const initialState = () => new State();

const reader = {
  tagIdToHighlight: () => (state) => state.get("tag_id_to_highlight"),
  display_root: () => (state) => state.get("display_root"),
  isZoomed: () => (state) => state.get("display_root").length > 0,
  widthBySize: () => (state) => state.get("width_by_size"),
};

const setDisplayRoot = (rootSequence) => (state) => {
  state = state.update("display_root", () => rootSequence);
  clearSelection();
  return state;
};

const setNoDisplayRoot = () => (state) => {
  state = state.update("display_root", () => []);
  clearSelection();
  return state;
};

const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection()?.removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

const setTagIdToHighlight = (tag) => (state) => {
  state = state.update("tag_id_to_highlight", () => tag);
  return state;
};

const setNoTagIdToHighlight = () => (state) => {
  state = state.update("tag_id_to_highlight", () => "");
  return state;
};

const toggleChangeWidthBySize = () => (state) => {
  addTracker({
    title: ActionTitle.TOGGLE_VIEW_BY_VOLUME_NUMBER,
    type: ActionType.TRACK_EVENT,
  });

  state = state.update("width_by_size", (a) => !a);
  return state;
};

const reInit = () => () => initialState();

const writer = {
  setDisplayRoot,
  setNoDisplayRoot,
  setTagIdToHighlight,
  setNoTagIdToHighlight,
  toggleChangeWidthBySize,
  reInit,
};

export default RealEstate.create({
  property_name: propertyName,
  initialState,
  reader,
  writer,
});
