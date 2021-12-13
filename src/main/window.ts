import type { BrowserWindow } from "electron";

import { ipcMain } from "../common/ipc";

declare module "../common/ipc/event" {
    interface SyncIpcMapping {
        "window.getSize": IpcConfig<[], number[]>;
        "window.setSize": IpcConfig<[width: number, heigth: number], void>;
        "window.show": IpcConfig<[], void>;
        "window.reload": IpcConfig<[], void>;
    }
}

export const loadWindow = (window: BrowserWindow): void => {
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
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        event.returnValue = window.setSize(width, heigth);
    });
};
