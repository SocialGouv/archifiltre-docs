import { ipcMain } from "electron";

import { computeHash } from "../util/hash/hash-util";

export const loadHash = () => {
    ipcMain.handle("computeHash", async (_event, filePath: string) => {
        return computeHash(filePath);
    });
};
