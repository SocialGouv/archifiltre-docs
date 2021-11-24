import { app, ipcMain } from "electron";

type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

export const loadApp = () => {
  ipcMain.handle(
    "getPath",
    (_event, pathId: Parameters<typeof app["getPath"]>[0]) =>
      app.getPath(pathId)
  );
};
