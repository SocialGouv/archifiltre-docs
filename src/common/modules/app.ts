import type { Dialog, Shell } from "electron";
import { app, dialog, shell } from "electron";

import { ipcMain } from "../ipc";

declare module "../ipc/event" {
  interface SyncIpcMapping {
    "app.getAppPath": IpcConfig<[], string>;
    "app.getPath": IpcConfig<
      [pathId: Parameters<typeof app["getPath"]>[0]],
      string
    >;
  }

  interface AsyncIpcMapping {
    "dialog.showOpenDialog": IpcConfig<
      Parameters<Dialog["showOpenDialog"]>,
      ReturnType<Dialog["showOpenDialog"]>
    >;
    "dialog.showSaveDialog": IpcConfig<
      Parameters<Dialog["showSaveDialog"]>,
      ReturnType<Dialog["showSaveDialog"]>
    >;
    "shell.openExternal": IpcConfig<
      Parameters<Shell["openExternal"]>,
      ReturnType<Shell["openExternal"]>
    >;
    "shell.openPath": IpcConfig<
      Parameters<Shell["openPath"]>,
      ReturnType<Shell["openPath"]>
    >;
    "shell.showItemInFolder": IpcConfig<
      Parameters<Shell["showItemInFolder"]>,
      ReturnType<Shell["showItemInFolder"]>
    >;
  }
}

export const loadApp = (): void => {
  ipcMain.on("app.getPath", (event, pathId = "userData") => {
    event.returnValue = app.getPath(pathId);
  });

  ipcMain.on("app.getAppPath", (event) => {
    event.returnValue = app.getAppPath();
  });

  ipcMain.handle("dialog.showOpenDialog", async (_event, options) =>
    dialog.showOpenDialog(options)
  );
  ipcMain.handle("dialog.showSaveDialog", async (_event, options) =>
    dialog.showSaveDialog(options)
  );
  ipcMain.handle("shell.openPath", async (_event, path) =>
    shell.openPath(path)
  );
  ipcMain.handle("shell.showItemInFolder", (_event, fullPath) => {
    shell.showItemInFolder(fullPath);
  });
  ipcMain.handle("shell.openExternal", async (_event, fullPath, options) =>
    shell.openExternal(fullPath, options)
  );
};
