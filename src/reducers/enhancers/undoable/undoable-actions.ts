import { COMMIT, REDO, UNDO, UndoableActionTypes } from "./undoable-types";

/**
 * Action to undo the last action in all the reducers wrapped by undoable
 */
export const undoAction = (): UndoableActionTypes => ({
  type: UNDO
});

/**
 * Action to redo the last action in all the reducers wrapped by undoable
 */
export const redoAction = (): UndoableActionTypes => ({
  type: REDO
});

/**
 * Action to commit the current state in all the reducers wrapped by undoable
 */
export const commitAction = (): UndoableActionTypes => ({
  type: COMMIT
});
