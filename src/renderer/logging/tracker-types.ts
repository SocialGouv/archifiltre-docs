/* eslint-disable @typescript-eslint/naming-convention */
export interface TrackerAction {
  eventValue?: unknown;
  title?: ActionTitle;
  type: ActionType;
  value?: unknown;
}

export enum ActionType {
  TRACK_EVENT = "trackEvent",
}

export enum ActionTitle {
  ALIAS_ADDED = "Alias added to file/folder",
  AUDIT_REPORT_EXPORT = "Audit report export",
  CLICK_ON_TAB = "Click on tab",
  CSV_EXPORT = "CSV Export",
  CSV_WITH_HASHES_EXPORT = "CSV with hashes Export",
  DELETION_SCRIPT = "Deletion script",
  DESCRIPTION_ADDED = "Description added to file/folder",
  ELEMENT_MARKED_TO_DELETE = "Element marked to delete",
  ELEMENT_MOVED = "Element moved",
  EXCEL_EXPORT = "Excel Export",
  FILE_TREE_DROP = "FileTreeDrop",
  ICICLE_DOUBLE_CLICK = "Double click on icicle",
  JSON_EXPORT = "JSON Export",
  LOADING_TIME = "Loading time",
  METS_EXPORT = "METS Export",
  MOVE_MODE_ENABLED = "Move mode enabled",
  RESIP_EXPORT = "RESIP Export",
  SEARCH_PERFORMED = "Search performed",
  TAG_ADDED = "Tag added to file/folder",
  TOGGLE_ICICLES_COLOR = "Toggle icicles color",
  TOGGLE_ICICLES_SORT = "Toggle icicles sort",
  TOGGLE_ICICLES_WEIGHT = "Toggle icicles weight",
  TREE_CSV_EXPORT = "Tree CSV Export",
  ZOOM_PERFORMED = "Zoom performed",
}
