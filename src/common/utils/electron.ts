import type { App, Shell } from "electron";
import { app, shell } from "electron";

import { IS_MAIN } from "../config";
import { ipcRenderer } from "../ipc";

/**
 * Reloads the app. Acts like F5 or CTRL+R
 */
export const reloadApp = (): void => {
  ipcRenderer.sendSync("window.reload");
};

/**
 * Opens a link in the user's browser
 */
export const openLink = (...args: Parameters<Shell["openExternal"]>): void => {
  if (IS_MAIN) {
    void shell.openExternal(...args);
  } else {
    void ipcRenderer.invoke("shell.openExternal", ...args);
  }
};

export const getPath = (...args: Parameters<App["getPath"]>): string =>
  IS_MAIN ? app.getPath(...args) : ipcRenderer.sendSync("app.getPath", ...args);
