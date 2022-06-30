import { noop } from "lodash";
import { toast } from "react-toastify";

export enum NotificationDuration {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NORMAL = 10000,
  // aproximatively equals 3 years as Number.MAX_SAFE_INTEGER is not working
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PERMANENT = 100000000000,
}

/**
 * Displays a success notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 * @param callback - The function called on notification click
 * @param bodyClassNames - additional classes for the notification
 */
export const notifySuccess = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL,
  callback = noop,
  // TODO: transform params into options
  bodyClassNames: string[] = []
): void => {
  toast(`${title}\n${message}`, {
    autoClose: notificationDuration,
    bodyClassName: ["notification-success", ...bodyClassNames].join(" "),
    onClick: callback,
    type: toast.TYPE.SUCCESS,
  });
};

/**
 * Displays an error notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 * @param callback - The function called on notification click
 */
export const notifyError = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL,
  callback = noop
): void => {
  toast(`${title}\n${message}`, {
    autoClose: notificationDuration,
    bodyClassName: "notification-error",
    onClick: callback,
    type: toast.TYPE.ERROR,
  });
};

/**
 * Displays an info notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 * @param callback - The function called on notification click
 */
export const notifyInfo = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL,
  callback = noop
): void => {
  toast(`${title}\n${message}`, {
    autoClose: notificationDuration,
    bodyClassName: "notification-info",
    onClick: callback,
    type: toast.TYPE.INFO,
  });
};
