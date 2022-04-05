/* eslint-disable @typescript-eslint/no-unsafe-return */

import { isWindows } from "@common/utils/os";
import type { FsWin } from "fswin";

export const getFsWin = async (): Promise<FsWin> => {
  if (!isWindows() || !process.versions.electron) {
    return {} as FsWin;
  }

  if (process.arch === "ia32") {
    return import("fswin/electron/ia32/fswin.node");
  }
  return import("fswin/electron/x64/fswin.node");
};
