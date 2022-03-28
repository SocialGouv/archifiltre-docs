import { app, ipcMain, ipcRenderer } from "electron";
import path from "path";

export interface WorkerSerializedConfig {
  isMain: boolean;
  isWorker: true;
  isTest: boolean;
  isDev: boolean;
  isE2E: boolean;
  isMac: boolean;
  isPackaged: boolean;
  isDistMode: boolean;
  staticPath: string;
}

export const IS_WORKER = !!(process as NodeJS.Process | undefined)?.send;

const workerConfig: WorkerSerializedConfig = IS_WORKER
  ? JSON.parse(process.argv[3] ?? "{}")
  : ({} as WorkerSerializedConfig);
export const IS_MAIN = IS_WORKER
  ? workerConfig.isMain
  : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ((ipcMain && !ipcRenderer) as boolean);
export const IS_TEST = IS_WORKER
  ? workerConfig.isTest
  : !!process.env.NODE_ENV?.startsWith("test");
export const IS_DEV = IS_WORKER
  ? workerConfig.isDev
  : process.env.NODE_ENV !== "production" && !IS_TEST;
export const IS_E2E = IS_WORKER ? workerConfig.isE2E : !!process.env.E2E;
export const IS_MAC = IS_WORKER
  ? workerConfig.isMac
  : process.platform === "darwin";
const IS_PACKAGE_EVENT = "config.IS_PACKAGED";
if (IS_MAIN) {
  ipcMain.on(IS_PACKAGE_EVENT, (event) => {
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

export const workerSerializedConfig: WorkerSerializedConfig = {
  isDev: IS_DEV,
  isDistMode: IS_DIST_MODE,
  isE2E: IS_E2E,
  isMac: IS_MAC,
  isMain: IS_MAIN,
  isPackaged: IS_PACKAGED(),
  isTest: IS_TEST,
  isWorker: true,
  staticPath: STATIC_PATH,
};
