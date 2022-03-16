import { ipcMain } from "../ipc";
import type { HashComputingResult } from "../utils/hash";
import { computeHash } from "../utils/hash";
import type { HashComputingError } from "../utils/hash/hash-errors";

declare module "../ipc/event" {
  interface AsyncIpcMapping {
    "hash.computeHash": IpcConfig<
      [filePaths: string[]],
      (HashComputingError | HashComputingResult)[]
    >;
  }
}

export const loadHash = (): void => {
  ipcMain.handle("hash.computeHash", async (_event, filePaths) => {
    return Promise.all(filePaths.map(computeHash));
  });
};
