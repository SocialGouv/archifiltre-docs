import { ipcRenderer } from "electron";
import { shell } from "electron";

/**
 * Reloads the app. Acts like F5 or CTRL+R
 */
export const reloadApp = (): Promise<void> => ipcRenderer.invoke("resizeWindow");

/**
 * Opens a link in the user's browser
 * @param link
 */
export const openLink = (link: string): void => {
  shell.openExternal(link);
};

export const getPath = (pathId: string): string => 
   ipcRenderer.sendSync("getPath", pathId)
