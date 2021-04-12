import { getCurrentWindow } from "@electron/remote";
import { shell } from "electron";

/**
 * Reloads the app. Acts like F5 or CTRL+R
 */
export const reloadApp = (): void => getCurrentWindow().reload();

/**
 * Opens a link in the user's browser
 * @param link
 */
export const openLink = (link: string): void => {
  shell.openExternal(link);
};
