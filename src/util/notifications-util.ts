import { NotificationManager } from "react-notifications";

export enum NotificationDuration {
  NORMAL = 5000,
  LONG = 10000,
  PERMANENT = Number.MAX_SAFE_INTEGER
}

/**
 * Displays a success notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 */
export const notifySuccess = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL
): void => {
  NotificationManager.success(message, title, notificationDuration);
};

/**
 * Displays an error notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 */
export const notifyError = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL
): void => {
  NotificationManager.error(message, title, notificationDuration);
};

/**
 * Displays an info notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationDuration - The notification duration (in ms)
 */
export const notifyInfo = (
  message: string,
  title: string,
  notificationDuration = NotificationDuration.NORMAL
): void => {
  NotificationManager.info(message, title, notificationDuration);
};
