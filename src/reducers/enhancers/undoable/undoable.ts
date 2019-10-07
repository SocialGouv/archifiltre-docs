import redux, { Reducer } from "redux";
import {
  COMMIT,
  REDO,
  UNDO,
  UndoableActionTypes,
  UndoableState
} from "./undoable-types";

const undoable = <WrappedState, Action extends redux.Action>(
  reducer: Reducer<WrappedState, Action>,
  initialState: WrappedState
): Reducer<UndoableState<WrappedState>, Action | UndoableActionTypes> => {
  const wrappedInitialState: UndoableState<WrappedState> = {
    current: initialState,
    future: [],
    past: [],
    present: initialState
  };

  return (state = wrappedInitialState, action) => {
    let present: WrappedState;
    let past: WrappedState[];
    let future: WrappedState[];

    switch (action.type) {
      case UNDO:
        [present, ...past] = state.past;
        return {
          current: present,
          future: [state.present, ...state.future],
          past,
          present
        };
      case REDO:
        [present, ...future] = state.future;
        return {
          current: present,
          future,
          past: [state.present, ...state.past],
          present
        };
      case COMMIT:
        return {
          current: state.current,
          future: [],
          past: [state.present, ...state.past],
          present: state.current
        };
      default:
        return {
          current: reducer(state.current, action as Action),
          future: state ? state.future : [],
          past: state ? state.past : [],
          present: state.present
        };
    }
  };
};

export default undoable;
