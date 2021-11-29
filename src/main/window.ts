import { BrowserWindow, ipcMain } from "electron";

export const loadWindow = (window: BrowserWindow) => {
  ipcMain.handle("showWindow", () => {
    window.show();
  });
  ipcMain.handle("resizeWindow", () => {
    console.log("SORRY NO RESIZE");
  });
  ipcMain.on("getSize", (event) => {
    event.returnValue = window.getSize();
  });
  ipcMain.on("setSize", (event, width: number, heigth: number) => {
    event.returnValue = window.setSize(width, heigth);
  });
};
