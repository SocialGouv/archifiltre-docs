import _ from "lodash";
import { compose } from "lodash/fp";
import { mapValueBetweenEnums } from "util/enum/enum-util";
import { ActionTitle, ActionType, TrackerAction } from "./tracker-types";

declare global {
  interface Window {
    _paq: any[];
  }
  const FORCE_TRACKING: boolean;
  const MODE: string;
  const MATOMO_APPLICATION_ID: number;
  const MATOMO_URL: string;
}
/**
 * Inits the trackers needed for monitoring, here Matomo
 */
export const initTracker = (isActive: boolean): void => {
  if ((!FORCE_TRACKING && MODE !== "production") || !isActive) {
    return;
  }
  window._paq = window._paq || [];
  addMatomoTracker({
    type: MatomoActionType.SET_SITE_ID,
    value: MATOMO_APPLICATION_ID,
  });
  addMatomoTracker({
    type: MatomoActionType.SET_TRACKER_URL,
    value: `${MATOMO_URL}/piwik.php`,
  });
  addMatomoTracker({ type: MatomoActionType.ENABLE_LINK_TRACKING });
  addMatomoTracker({
    type: MatomoActionType.SET_CUSTOM_URL,
    value: location.pathname,
  });
  addMatomoTracker({ type: MatomoActionType.TRACK_PAGE_VIEW });
  const scriptElement = document.createElement("script");
  const refElement = document.getElementsByTagName("script")[0];
  scriptElement.type = "text/javascript";
  scriptElement.async = true;
  scriptElement.defer = true;
  scriptElement.src = `${MATOMO_URL}/piwik.js`;
  refElement?.parentNode?.insertBefore(scriptElement, refElement);
};

/**
 * Removes the null and undefined values from a trackerAction object
 * @param trackerAction
 */
const sanitizeTrackerData = (trackerAction) =>
  Object.values(trackerAction).filter(
    (actionProperty) =>
      !_.isUndefined(actionProperty) && !_.isNull(actionProperty)
  );

/**
 * Transforms an application action to a Matomo Action
 * @param trackerAction
 */
const mapActionToMatomoAction = (
  trackerAction: MatomoTrackerAction
): TrackerAction => {
  return {
    type: mapValueBetweenEnums(
      trackerAction.type,
      ActionType,
      MatomoActionType
    ),
    title: mapValueBetweenEnums(
      trackerAction.title,
      ActionTitle,
      MatomoActionTitle
    ),
    value: trackerAction.value,
    eventValue: trackerAction.eventValue,
  };
};

/**
 * Adds a Matomo tracker using an action
 * @param trackerAction
 */
const addMatomoTracker = (trackerAction: MatomoTrackerAction) => {
  if (!FORCE_TRACKING && MODE !== "production") {
    return;
  }

  if (window._paq) {
    const matomoAction = mapActionToMatomoAction(trackerAction);
    const sanitizedData = sanitizeTrackerData(matomoAction);
    window._paq.push(sanitizedData);
  }
};
/**
 * Adds a tracker using an action
 */
export const addTracker = compose(addMatomoTracker, mapActionToMatomoAction);

interface MatomoTrackerAction {
  type: MatomoActionType;
  title?: MatomoActionTitle;
  value?: any;
  eventValue?: any;
}

enum MatomoActionType {
  SET_SITE_ID = "setSiteId",
  SET_TRACKER_URL = "setTrackerUrl",
  ENABLE_LINK_TRACKING = "enableLinkTracking",
  SET_CUSTOM_URL = "setCustomUrl",
  TRACK_PAGE_VIEW = "trackPageView",
  TRACK_EVENT = "trackEvent",
}

enum MatomoActionTitle {
  FILE_TREE_DROP = "FileTreeDrop",
  AUDIT_REPORT_EXPORT = "Audit report export",
  CSV_EXPORT = "CSV Export",
  CSV_WITH_HASHES_EXPORT = "CSV with hashes Export",
  RESIP_EXPORT = "RESIP Export",
  METS_EXPORT = "METS Export",
  JSON_EXPORT = "JSON Export",
  TREE_CSV_EXPORT = "Tree CSV Export",
  EXCEL_EXPORT = "Excel Export",
  TOGGLE_VIEW_BY_VOLUME_NUMBER = "Toggle view by volume or number",
  TOGGLE_VIEW_BY_TYPE_DATES = "Toggle view by type or dates",
  ICICLE_ZOOM = "Zoom on icicle",
  TAG_ADDED = "Tag added to file/folder",
  DESCRIPTION_ADDED = "Description added to file/folder",
  ALIAS_ADDED = "Alias added to file/folder",
  LOADING_TIME = "Loading time",
  MOVE_MODE_ENABLED = "Move mode enabled",
  SEARCH_PERFORMED = "Search performed",
  ELEMENT_MOVED = "Element moved",
  ELEMENT_MARKED_TO_DELETE = "Element marked to delete",
  CLICK_ON_TAB = "Click on tab",
}
