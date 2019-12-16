import { NotificationManager } from "react-notifications";

export enum NotificationTimeout {
  SHORT = 3000,
  NORMAL = 5000,
  LONG = 10000
}

/**
 * Displays a success notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationTimeout - The notification timeout (in ms)
 */
export const notifySuccess = (
  message: string,
  title: string,
  notificationTimeout = NotificationTimeout.NORMAL
): void => {
  NotificationManager.success(message, title, notificationTimeout);
};

/**
 * Displays an error notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationTimeout - The notification timeout (in ms)
 */
export const notifyError = (
  message: string,
  title: string,
  notificationTimeout = NotificationTimeout.NORMAL
): void => {
  NotificationManager.error(message, title, notificationTimeout);
};

/**
 * Displays an info notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 * @param notificationTimeout - The notification timeout (in ms)
 */
export const notifyInfo = (
  message: string,
  title: string,
  notificationTimeout = NotificationTimeout.NORMAL
): void => {
  NotificationManager.info(message, title, notificationTimeout);
};
