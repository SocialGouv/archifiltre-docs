import _ from "lodash";
import { compose } from "lodash/fp";
import { mapValueBetweenEnums } from "../util/enum-util";
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
 * Inits the trackers needed for monitioring, here Matomo
 */
export const initTracker = () => {
  if (!FORCE_TRACKING && MODE !== "production") {
    return;
  }
  window._paq = window._paq || [];
  addMatomoTracker({
    type: MatomoActionType.SET_SITE_ID,
    value: MATOMO_APPLICATION_ID
  });
  addMatomoTracker({
    type: MatomoActionType.SET_TRACKER_URL,
    value: `${MATOMO_URL}/piwik.php`
  });
  addMatomoTracker({ type: MatomoActionType.ENABLE_LINK_TRACKING });
  addMatomoTracker({
    type: MatomoActionType.SET_CUSTOM_URL,
    value: location.pathname
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
const sanitizeTrackerData = trackerAction =>
  Object.values(trackerAction).filter(
    actionProperty =>
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
    // tslint:disable-next-line:object-literal-sort-keys
    title: mapValueBetweenEnums(
      trackerAction.title,
      ActionTitle,
      MatomoActionTitle
    ),
    value: trackerAction.value
  };
};

/**
 * Adds a matomo tracker using an action
 * @param trackerAction
 */
const addMatomoTracker = (trackerAction: MatomoTrackerAction) => {
  if (window._paq) {
    const matomoAction = mapActionToMatomoAction(trackerAction);
    const sanitizedData = sanitizeTrackerData(matomoAction);
    window._paq.push(sanitizedData);
  }
};
/**
 * Adds a tracker using an action
 */
export const addTracker = () => {
  if (!FORCE_TRACKING && MODE !== "production") {
    return;
  }
  return compose(addMatomoTracker, mapActionToMatomoAction);
};

interface MatomoTrackerAction {
  type: MatomoActionType;
  title?: MatomoActionTitle;
  value?: any;
}

enum MatomoActionType {
  SET_SITE_ID = "setSiteId",
  SET_TRACKER_URL = "setTrackerUrl",
  ENABLE_LINK_TRACKING = "enableLinkTracking",
  SET_CUSTOM_URL = "setCustomUrl",
  TRACK_PAGE_VIEW = "trackPageView",
  TRACK_EVENT = "trackEvent"
}

enum MatomoActionTitle {
  FILE_TREE_DROP = "FileTreeDrop"
}
