import { ipcMain } from "../common/ipc";
import { BrowserWindow } from "electron";
declare module "../common/ipc/event" {
  interface SyncIpcMapping {
    "window.getSize": IpcConfig<[], number[]>;
    "window.setSize": IpcConfig<[width: number, heigth: number], void>;
  }
  interface AsyncIpcMapping {
    "window.showWindow": IpcConfig<[], void>;
    "window.resizeWindow": IpcConfig<[], void>;
  }
}

export const loadWindow = (window: BrowserWindow) => {
  ipcMain.handle("window.showWindow", () => {
    window.show();
  });
  ipcMain.handle("window.resizeWindow", () => {
    console.log("SORRY NO RESIZE");
  });
  ipcMain.on("window.getSize", (event) => {
    event.returnValue = window.getSize();
  });
  ipcMain.on("window.setSize", (event, width, heigth) => {
    event.returnValue = window.setSize(width, heigth);
  });
};
