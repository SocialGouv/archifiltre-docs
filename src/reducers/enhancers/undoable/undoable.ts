import type { Reducer } from "redux";
import type redux from "redux";

import type { UndoableActionTypes, UndoableState } from "./undoable-types";
import { COMMIT, REDO, UNDO } from "./undoable-types";

export const undoable = <TWrappedState, TAction extends redux.Action>(
  reducer: Reducer<TWrappedState, TAction>,
  initialState: TWrappedState
): Reducer<UndoableState<TWrappedState>, TAction | UndoableActionTypes> => {
  const wrappedInitialState: UndoableState<TWrappedState> = {
    current: initialState,
    future: [],
    past: [],
    present: initialState,
  };

  return (state = wrappedInitialState, action?) => {
    let present = {} as TWrappedState;
    let past: TWrappedState[] = [];
    let future: TWrappedState[] = [];

    switch (action.type) {
      case UNDO:
        [present, ...past] = state.past;
        return {
          current: present,
          future: [state.present, ...state.future],
          past,
          present,
        };
      case REDO:
        [present, ...future] = state.future;
        return {
          current: present,
          future,
          past: [state.present, ...state.past],
          present,
        };
      case COMMIT:
        return {
          current: state.current,
          future: [],
          past: [state.present, ...state.past],
          present: state.current,
        };
      default:
        return {
          current: reducer(state.current, action as TAction),
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          future: state?.future ?? [],
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          past: state?.past ?? [],
          present: state.present,
        };
    }
  };
};
