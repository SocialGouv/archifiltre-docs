import { NotificationManager } from "react-notifications";

const NOTIFICATION_TIMEOUT = 5000;

/**
 * Display a success notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 */
export const notifySuccess = (message: string, title: string): void => {
  NotificationManager.success(message, title, NOTIFICATION_TIMEOUT);
};

/**
 * Display an error notification on the screen.
 * @param message - The notification message
 * @param title - The notification title
 */
export const notifyError = (message: string, title: string): void => {
  NotificationManager.error(message, title, NOTIFICATION_TIMEOUT);
};
