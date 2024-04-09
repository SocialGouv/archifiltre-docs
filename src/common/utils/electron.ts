import { type App, app, type Shell, shell } from "electron";

import { IS_MAIN } from "../config";
import { ipcRenderer } from "../ipc";

/**
 * Reloads the app. Acts like F5 or CTRL+R
 */
export const reloadApp = async (): Promise<void> => {
  await ipcRenderer.invoke("window.reload");
};

/**
 * Opens a link in the user's browser
 */
export const openLink = (...args: Parameters<Shell["openExternal"]>): void => {
  if (IS_MAIN) {
    void shell.openExternal(...args);
    return;
  }
  void ipcRenderer.invoke("shell.openExternal", ...args);
};

export function getPath(...args: Parameters<App["getPath"]>): string {
  if (IS_MAIN) {
    return app.getPath(...args);
  }

  try {
    return ipcRenderer.sendSync("app.getPath", ...args);
  } catch (error: unknown) {
    console.error("Erreur lors de la communication avec le processus principal:", error);
    throw error;
  }
}
