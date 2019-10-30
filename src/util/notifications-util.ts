import { NotificationManager } from "react-notifications";

const NOTIFICATION_TIMEOUT = 5000;

/**
 * Displays a success notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 */
export const notifySuccess = (message: string, title: string): void => {
  NotificationManager.success(message, title, NOTIFICATION_TIMEOUT);
};

/**
 * Displays an error notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 */
export const notifyError = (message: string, title: string): void => {
  NotificationManager.error(message, title, NOTIFICATION_TIMEOUT);
};

/**
 * Displays an info notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 */
export const notifyInfo = (message: string, title: string): void => {
  NotificationManager.info(message, title, NOTIFICATION_TIMEOUT);
};
