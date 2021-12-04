import { ipcRenderer } from "../../common/ipc";
import { shell } from "electron";
import type { App } from "electron";

/**
 * Reloads the app. Acts like F5 or CTRL+R
 */
export const reloadApp = () => ipcRenderer.invoke("window.resizeWindow"); // TODO: Resize is not working. Did you mean reload?

/**
 * Opens a link in the user's browser
 * @param link
 */
export const openLink = (link: string): void => {
  shell.openExternal(link);
};

export const getPath = (pathId: Parameters<App["getPath"]>[0]): string => 
   ipcRenderer.sendSync("app.getPath", pathId);
