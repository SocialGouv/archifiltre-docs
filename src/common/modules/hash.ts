import { ipcMain } from "../ipc";
import { computeHash, type HashComputingResult } from "../utils/hash";
import { type HashComputingError } from "../utils/hash/hash-errors";

declare module "../ipc/event" {
  interface AsyncIpcMapping {
    "hash.computeHash": IpcConfig<[filePaths: string[]], Array<HashComputingError | HashComputingResult>>;
  }
}

export const loadHash = (): void => {
  ipcMain.handle("hash.computeHash", async (_event, filePaths) => {
    return Promise.all(filePaths.map(computeHash));
  });
};
