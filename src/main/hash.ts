import type { HashComputingError } from "@common/utils/hash/hash-errors";
import type { HashComputingResult } from "@common/utils/hash/hash-util";
import { computeHash } from "@common/utils/hash/hash-util";

import { ipcMain } from "../common/ipc";

declare module "@common/ipc/event" {
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
