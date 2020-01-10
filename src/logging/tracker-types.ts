export interface TrackerAction {
  type: ActionType;
  title?: ActionTitle;
  value?: any;
  eventValue?: any;
}

export enum ActionType {
  TRACK_EVENT = "trackEvent"
}

export enum ActionTitle {
  FILE_TREE_DROP = "FileTreeDrop",
  AUDIT_REPORT_EXPORT = "Audit report export",
  CSV_EXPORT = "CSV Export",
  RESIP_EXPORT = "RESIP Export",
  METS_EXPORT = "METS Export",
  JSON_EXPORT = "JSON Export",
  TOGGLE_VIEW_BY_VOLUME_NUMBER = "Toggle view by volume or number",
  TOGGLE_VIEW_BY_TYPE_DATES = "Toggle view by type or dates",
  ICICLE_ZOOM = "Zoom on icicle",
  TAG_ADDED = "Tag added to file/folder",
  DESCRIPTION_ADDED = "Description added to file/folder",
  ALIAS_ADDED = "Alias added to file/folder",
  LOADING_TIME = "Loading time"
}
