import { NotificationManager } from "react-notifications";

const NOTIFICATION_TIMEOUT = 5000;

/**
 * Display a success notification to the screen.
 * @param message - The notification message
 * @param title - The notification title
 */
export const notifySuccess = (message: string, title: string): void => {
  NotificationManager.success(message, title, NOTIFICATION_TIMEOUT);
};
