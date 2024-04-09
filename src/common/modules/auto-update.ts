import { autoUpdater, type ProgressInfo, type UpdateInfo } from "electron-updater";

import { IS_MAIN, PRODUCT_CHANNEL } from "../config";
import { ipcMain } from "../ipc";
import { type DualIpcConfig } from "../ipc/event";
import { version } from "../utils/package";
import { getTrackerProvider } from "./tracker";

type AutoUpdateCheckIpcConfig =
  | DualIpcConfig<"autoUpdate.onError", [], [error: string]>
  | DualIpcConfig<"autoUpdate.onUpdateAvailable", [], [info: UpdateInfo | false]>;

declare module "../ipc/event" {
  interface SyncIpcMapping {
    "autoUpdate.doUpdate": IpcConfig<[], boolean>;
  }

  interface DualAsyncIpcMapping {
    "autoUpdate.check": AutoUpdateCheckIpcConfig;
  }
}

type Replier = <T extends AutoUpdateCheckIpcConfig["replyKey"]>(
  replyChannel: T,
  ...args: Extract<AutoUpdateCheckIpcConfig, { replyKey: T }>["returnValue"]
) => void;

let quitForUpdate = false;
export const isQuitingForUpdate = (): boolean => quitForUpdate;

let setup = false;
export const setupAutoUpdate = (): void => {
  if (!IS_MAIN || setup) return;
  setup = true;
  autoUpdater.logger = console;
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = false;
  autoUpdater.autoInstallOnAppQuit = PRODUCT_CHANNEL !== "stable";

  const repliers: Replier[] = [];
  let updateAvailable = false;
  ipcMain.on("autoUpdate.check", async evt => {
    repliers.push(evt.reply);
    await autoUpdater.checkForUpdates();
  });
  ipcMain.on("autoUpdate.doUpdate", evt => {
    evt.returnValue = updateAvailable;

    if (!updateAvailable) {
      return;
    }

    quitForUpdate = true;
    autoUpdater.quitAndInstall();
  });

  // setup auto updater events
  autoUpdater.on("checking-for-update", () => {
    console.info("[setupAutoUpdate] Check for update");
  });

  autoUpdater.on("update-available", async (info: UpdateInfo) => {
    console.info("[setupAutoUpdate] Update available", info);
    await autoUpdater.downloadUpdate();
  });

  autoUpdater.on("update-not-available", (info: UpdateInfo) => {
    console.info("[setupAutoUpdate] Update NOT available", info);
    repliers.forEach(reply => {
      reply("autoUpdate.onUpdateAvailable", false);
    });
  });

  autoUpdater.on("error", (err, reason) => {
    console.error("[setupAutoUpdate] Error", reason, err);
    repliers.forEach(reply => {
      reply("autoUpdate.onError", reason as string);
    });
  });

  autoUpdater.on("download-progress", (progress: ProgressInfo) => {
    console.info("[setupAutoUpdate] Progress...", progress);
  });

  autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
    console.info("[setupAutoUpdate] Update downloaded", info);
    updateAvailable = true;
    getTrackerProvider().track("App Updated", {
      currentVersion: info.version,
      oldVersion: version,
    });
    repliers.forEach(reply => {
      reply("autoUpdate.onUpdateAvailable", info);
    });
  });
};
