/* eslint-disable @typescript-eslint/naming-convention */
import { FORCE_TRACKING, IS_PACKAGED } from "@common/config";
import { mapValueBetweenEnums } from "@common/utils/enum";
import _ from "lodash";
import { compose } from "lodash/fp";

import type { TrackerAction } from "./tracker-types";
import { ActionTitle, ActionType } from "./tracker-types";

declare global {
  interface Window {
    _paq?: unknown[];
  }
}
/**
 * Inits the trackers needed for monitoring, here Matomo
 */
export const initTracker = (isActive: boolean): void => {
  if ((!FORCE_TRACKING && !IS_PACKAGED()) || !isActive) {
    return;
  }
  window._paq = window._paq ?? [];
  addMatomoTracker({
    type: MatomoActionType.SET_SITE_ID,
    value: process.env.TRACKER_MATOMO_ID_SITE,
  });
  addMatomoTracker({
    type: MatomoActionType.SET_TRACKER_URL,
    value: `${process.env.TRACKER_MATOMO_URL}/piwik.php`,
  });
  addMatomoTracker({ type: MatomoActionType.ENABLE_LINK_TRACKING });
  addMatomoTracker({
    type: MatomoActionType.SET_CUSTOM_URL,
    value: process.env.TRACKER_FAKE_HREF,
  });
  addMatomoTracker({ type: MatomoActionType.TRACK_PAGE_VIEW });
  const scriptElement = document.createElement("script");
  const refElement = document.getElementsByTagName("script")[0];
  scriptElement.type = "text/javascript";
  scriptElement.async = true;
  scriptElement.defer = true;
  scriptElement.src = `${process.env.TRACKER_MATOMO_URL}/piwik.js`;
  refElement.parentNode?.insertBefore(scriptElement, refElement);
};

/**
 * Removes the null and undefined values from a trackerAction object
 */
const sanitizeTrackerData = (trackerAction: MatomoTrackerAction) =>
  sanitizedMatomoActionOrderedKeys
    .map((key) => trackerAction[key])
    .filter(
      (actionProperty) =>
        !_.isUndefined(actionProperty) && !_.isNull(actionProperty)
    );

/**
 * Transforms an application action to a Matomo Action
 */
const mapActionToMatomoAction = (
  trackerAction: TrackerAction
): MatomoTrackerAction => {
  return {
    eventValue: trackerAction.eventValue,
    title: mapValueBetweenEnums(
      trackerAction.title,
      ActionTitle,
      MatomoActionTitle
    ),
    type: mapValueBetweenEnums(
      trackerAction.type,
      ActionType,
      MatomoActionType
    ),
    value: trackerAction.value,
  };
};

/**
 * Matomo requires a non null non empty string value for any event,
 * so an "_" is added to events with no value
 */
const handleMatomoValue = (matomoAction: MatomoTrackerAction) => {
  if (!matomoAction.value) {
    matomoAction.value = "_";
  }
  return matomoAction;
};

/**
 * Adds a Matomo tracker using an action
 */
const addMatomoTracker = (
  trackerAction: MatomoTrackerAction | TrackerAction
) => {
  if (!FORCE_TRACKING && !IS_PACKAGED()) {
    return;
  }

  if (window._paq) {
    const matomoAction = mapActionToMatomoAction(
      trackerAction as TrackerAction
    );
    const matomoActionWithValue = handleMatomoValue(matomoAction);
    const sanitizedData = sanitizeTrackerData(matomoActionWithValue);
    try {
      window._paq.push(sanitizedData);
    } catch {
      return;
    }
  }
};
/**
 * Adds a tracker using an action
 */
export const addTracker = compose(addMatomoTracker, mapActionToMatomoAction);

interface MatomoTrackerAction {
  eventValue?: unknown;
  title?: MatomoActionTitle;
  type: MatomoActionType;
  value?: unknown;
}

const sanitizedMatomoActionOrderedKeys: (keyof MatomoTrackerAction)[] = [
  "type",
  "title",
  "value",
  "eventValue",
];

enum MatomoActionType {
  ENABLE_LINK_TRACKING = "enableLinkTracking",
  SET_CUSTOM_URL = "setCustomUrl",
  SET_SITE_ID = "setSiteId",
  SET_TRACKER_URL = "setTrackerUrl",
  TRACK_EVENT = "trackEvent",
  TRACK_PAGE_VIEW = "trackPageView",
}

enum MatomoActionTitle {
  ALIAS_ADDED = "Alias added to file/folder",
  AUDIT_REPORT_EXPORT = "Audit report export",
  CLICK_ON_TAB = "Click on tab",
  CSV_EXPORT = "CSV Export",
  CSV_WITH_HASHES_EXPORT = "CSV with hashes Export",
  DESCRIPTION_ADDED = "Description added to file/folder",
  ELEMENT_MARKED_TO_DELETE = "Element marked to delete",
  ELEMENT_MOVED = "Element moved",
  EXCEL_EXPORT = "Excel Export",
  FILE_TREE_DROP = "FileTreeDrop",
  ICICLE_ZOOM = "Zoom on icicle",
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
