import type { UndoableState } from "./undoable-types";

/**
 * Returns the present state for the wrapped reducer
 * @param state
 */
export const getCurrentState = <TWrappedState>(
  state: UndoableState<TWrappedState>
): TWrappedState => state.current;

export const canStateUndo = <TWrappedState>(
  state: UndoableState<TWrappedState>
): boolean => state.past.length > 0;

export const canStateRedo = <TWrappedState>(
  state: UndoableState<TWrappedState>
): boolean => state.future.length > 0;
