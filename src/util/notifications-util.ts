import { NotificationManager } from "react-notifications";
import { empty } from "./function-util";

// aproximatively equals 3 years as Number.MAX_SAFE_INTEGER is not working
const arbitrarilyLongTime = 100000000000;

export enum NotificationDuration {
  NORMAL = 5000,
  PERMANENT = arbitrarilyLongTime,
}

/**
 * Displays a success notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 * @param callback - The function called on notification click
 */
export const notifySuccess = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL,
  callback = empty
): void => {
  NotificationManager.success(message, title, notificationDuration, callback);
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
  callback = empty
): void => {
  NotificationManager.error(message, title, notificationDuration, callback);
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
  callback = empty
): void => {
  NotificationManager.info(message, title, notificationDuration, callback);
};
