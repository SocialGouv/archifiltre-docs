import { UndoableState } from "./undoable-types";

/**
 * Returns the present state for the wrapped reducer
 * @param state
 */
export const getCurrentState = <WrappedState>(
  state: UndoableState<WrappedState>
): WrappedState => state.current;
