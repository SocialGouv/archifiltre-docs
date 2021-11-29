import { app, ipcMain } from "electron";

export const loadApp = () => {
    ipcMain.on(
        "getPath",
        (event, pathId: Parameters<typeof app["getPath"]>[0]) => {
            event.returnValue = app.getPath("userData");
        }
    );
};
