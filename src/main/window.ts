import { BrowserWindow, ipcMain } from "electron";

export const loadWindow = (window: BrowserWindow) => {
  ipcMain.handle("showWindow", () => {
    window.show();
  });
  ipcMain.handle("resizeWindow", () => {
    window.resize();
  });
};
