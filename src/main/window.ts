import { ipcMain } from "../common/ipc";
import { BrowserWindow } from "electron";
declare module "../common/ipc/event" {
  interface SyncIpcMapping {
    "window.getSize": IpcConfig<[], number[]>;
    "window.setSize": IpcConfig<[width: number, heigth: number], void>;
    "window.show": IpcConfig<[], void>;
    "window.reload": IpcConfig<[], void>;
  }
}

export const loadWindow = (window: BrowserWindow) => {
  ipcMain.on("window.show", () => {
    window.show();
  });
  ipcMain.on("window.reload", () => {
    window.reload();
  });
  ipcMain.on("window.getSize", (event) => {
    event.returnValue = window.getSize();
  });
  ipcMain.on("window.setSize", (event, width, heigth) => {
    event.returnValue = window.setSize(width, heigth);
  });
};
