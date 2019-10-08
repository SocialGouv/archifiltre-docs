export const UNDO = "UNDOABLE/UNDO";
export const REDO = "UNDOABLE/REDO";
export const COMMIT = "UNDOABLE/COMMIT";

export interface UndoableState<WrappedState> {
  current: WrappedState;
  past: WrappedState[];
  present: WrappedState;
  future: WrappedState[];
}

interface UndoAction {
  type: typeof UNDO;
}

interface RedoAction {
  type: typeof REDO;
}

interface CommitAction {
  type: typeof COMMIT;
}

export type UndoableActionTypes = UndoAction | RedoAction | CommitAction;
