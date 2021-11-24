import { computeHash } from "../util/hash/hash-util";
import { ipcMain } from "electron";

export const loadHash = () => {
  ipcMain.handle("computeHash", (_event, filePath: string) => {
    return computeHash(filePath);
  });
};
