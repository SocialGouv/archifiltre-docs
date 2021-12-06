import { computeHash, HashComputingResult } from "../util/hash/hash-util";
import { ipcMain } from "../common/ipc";
import { HashComputingError } from "../util/hash/hash-errors";

declare module "../common/ipc/event" {
  interface AsyncIpcMapping {
    "hash.computeHash": IpcConfig<[filePaths: string[]], (HashComputingResult | HashComputingError)[]>
  }
}

export const loadHash = () => {
  ipcMain.handle("hash.computeHash", (_event, filePaths) => {
    return Promise.all(filePaths.map(computeHash));
  });
};
