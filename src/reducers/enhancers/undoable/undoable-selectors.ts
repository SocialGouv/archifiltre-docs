import { UndoableState } from "./undoable-types";

/**
 * Returns the present state for the wrapped reducer
 * @param state
 */
export const getCurrentState = <WrappedState>(
  state: UndoableState<WrappedState>
): WrappedState => state.current;

export const canStateUndo = <WrappedState>(
  state: UndoableState<WrappedState>
): boolean => state.past.length > 0;

export const canStateRedo = <WrappedState>(
  state: UndoableState<WrappedState>
): boolean => state.future.length > 0;
