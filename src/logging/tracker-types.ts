export interface TrackerAction {
  type: ActionType;
  title?: ActionTitle;
  value?: any;
}

export enum ActionType {
  TRACK_EVENT = "trackEvent"
}

export enum ActionTitle {
  FILE_TREE_DROP = "FileTreeDrop"
}
