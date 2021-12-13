import { ipcMain } from "../common/ipc";
import type { HashComputingError } from "../util/hash/hash-errors";
import type { HashComputingResult } from "../util/hash/hash-util";
import { computeHash } from "../util/hash/hash-util";

declare module "../common/ipc/event" {
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
