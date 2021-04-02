export interface TrackerAction {
  type: ActionType;
  title?: ActionTitle;
  value?: any;
  eventValue?: any;
}

export enum ActionType {
  TRACK_EVENT = "trackEvent",
}

export enum ActionTitle {
  FILE_TREE_DROP = "FileTreeDrop",
  AUDIT_REPORT_EXPORT = "Audit report export",
  CSV_EXPORT = "CSV Export",
  CSV_WITH_HASHES_EXPORT = "CSV with hashes Export",
  RESIP_EXPORT = "RESIP Export",
  METS_EXPORT = "METS Export",
  JSON_EXPORT = "JSON Export",
  TREE_CSV_EXPORT = "Tree CSV Export",
  EXCEL_EXPORT = "Excel Export",
  TOGGLE_ICICLES_WEIGHT = "Toggle icicles weight",
  TOGGLE_ICICLES_COLOR = "Toggle icicles color",
  TOGGLE_ICICLES_SORT = "Toggle icicles sort",
  ICICLE_DOUBLE_CLICK = "Double click on icicle",
  DELETION_SCRIPT = "Deletion script",
  TAG_ADDED = "Tag added to file/folder",
  DESCRIPTION_ADDED = "Description added to file/folder",
  ALIAS_ADDED = "Alias added to file/folder",
  LOADING_TIME = "Loading time",
  MOVE_MODE_ENABLED = "Move mode enabled",
  SEARCH_PERFORMED = "Search performed",
  ELEMENT_MOVED = "Element moved",
  ELEMENT_MARKED_TO_DELETE = "Element marked to delete",
  CLICK_ON_TAB = "Click on tab",
  ZOOM_PERFORMED = "Zoom performed",
}
