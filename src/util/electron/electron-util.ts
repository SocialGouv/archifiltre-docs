import { remote } from "electron";

/**
 * Reloads the app. Acts like F5 or CTRL+R
 */
export const reloadApp = (): void => remote.getCurrentWindow().reload();
