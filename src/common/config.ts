import path from "path";

import { version } from "./utils/package";
import { isTruthy } from "./utils/string";

export const IS_WORKER = !!(process as NodeJS.Process | undefined)?.send;
const { app, ipcMain, ipcRenderer } = IS_WORKER
  ? // eslint-disable-next-line @typescript-eslint/consistent-type-imports -- deal with it
    ({} as typeof import("electron"))
  : require("electron");

export interface WorkerSerializedConfig {
  forceTracking: boolean;
  isCi: boolean;
  isDev: boolean;
  isDistMode: boolean;
  isE2E: boolean;
  isMac: boolean;
  isMain: boolean;
  isPackaged: boolean;
  isTest: boolean;
  isWorker: true;
  productChannel: "beta" | "next" | "stable";
  resourcesPath: string;
  staticPath: string;
}

const workerConfig: WorkerSerializedConfig = (() => {
  if (IS_WORKER) {
    try {
      return JSON.parse(process.argv[3] ?? "{}") as WorkerSerializedConfig;
    } catch {
      console.error(`Unparsable process argv (${JSON.stringify(process.argv[3])})`);
    }
  }

  return {} as WorkerSerializedConfig;
})();
// TODO: logo, config, bug repport enable in beta/next
export const PRODUCT_CHANNEL = IS_WORKER
  ? workerConfig.productChannel
  : version.includes("beta")
    ? "beta"
    : version.includes("next")
      ? "next"
      : "stable";
export const IS_CI = IS_WORKER ? workerConfig.isCi : process.env.CI === "true";
export const IS_MAIN = IS_WORKER ? workerConfig.isMain : ((ipcMain && !ipcRenderer) as boolean);
export const IS_TEST = IS_WORKER ? workerConfig.isTest : !!process.env.NODE_ENV?.startsWith("test");
export const IS_DEV = IS_WORKER ? workerConfig.isDev : process.env.NODE_ENV !== "production" && !IS_TEST;
export const IS_E2E = IS_WORKER ? workerConfig.isE2E : !!process.env.E2E;
export const FORCE_TRACKING = isTruthy(process.env.FORCE_TRACKING);
export const IS_MAC = IS_WORKER ? workerConfig.isMac : process.platform === "darwin";
const IS_PACKAGE_EVENT = "config.IS_PACKAGED";
if (IS_MAIN) {
  ipcMain.on(IS_PACKAGE_EVENT, event => {
    event.returnValue = app.isPackaged;
  });
}

export const IS_PACKAGED = (): boolean => {
  if (IS_WORKER) return workerConfig.isPackaged;
  if (IS_MAIN) return app.isPackaged;
  return ipcRenderer.sendSync(IS_PACKAGE_EVENT, []) as boolean;
};

export const IS_DIST_MODE = IS_WORKER
  ? workerConfig.isDistMode
  : !IS_PACKAGED() && !process.env.ELECTRON_WEBPACK_WDS_PORT;

export const STATIC_PATH = IS_WORKER
  ? workerConfig.staticPath
  : IS_PACKAGED()
    ? __static // prod
    : !process.env.ELECTRON_WEBPACK_WDS_PORT
      ? path.resolve(__dirname, "../../static") // dist / e2e
      : __static; // dev

export const RESOURCES_PATH = IS_WORKER
  ? workerConfig.resourcesPath
  : IS_PACKAGED()
    ? path.resolve(process.resourcesPath) // prod
    : IS_DIST_MODE
      ? path.resolve(__dirname) // dist / e2e
      : path
          .resolve(__dirname, "..", IS_MAIN ? "main" : "renderer")
          .replace(`${path.sep}src${path.sep}`, `${path.sep}dist${path.sep}`); // dev

export const workerSerializedConfig: WorkerSerializedConfig = {
  forceTracking: FORCE_TRACKING,
  isCi: IS_CI,
  isDev: IS_DEV,
  isDistMode: IS_DIST_MODE,
  isE2E: IS_E2E,
  isMac: IS_MAC,
  isMain: IS_MAIN,
  isPackaged: IS_PACKAGED(),
  isTest: IS_TEST,
  isWorker: true,
  productChannel: PRODUCT_CHANNEL,
  resourcesPath: RESOURCES_PATH,
  staticPath: STATIC_PATH,
};
