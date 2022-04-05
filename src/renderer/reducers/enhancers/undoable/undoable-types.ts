export const UNDO = "UNDOABLE/UNDO";
export const REDO = "UNDOABLE/REDO";
export const COMMIT = "UNDOABLE/COMMIT";

export interface UndoableState<TWrappedState> {
  current: TWrappedState;
  future: TWrappedState[];
  past: TWrappedState[];
  present: TWrappedState;
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

export type UndoableActionTypes = CommitAction | RedoAction | UndoAction;
