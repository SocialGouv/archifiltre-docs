import { app, ipcMain, ipcRenderer } from "electron";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const IS_MAIN = (ipcMain && !ipcRenderer) as boolean;
export const IS_TEST = !!process.env.NODE_ENV?.startsWith("test");
export const IS_DEV = process.env.NODE_ENV !== "production" && !IS_TEST;
export const IS_E2E = !!process.env.E2E;
export const IS_MAC = process.platform === "darwin";
const IS_PACKAGE_EVENT = "config.IS_PACKAGED";
if (IS_MAIN) {
  ipcMain.on(IS_PACKAGE_EVENT, (event) => {
    event.returnValue = app.isPackaged;
  });
}

export const IS_PACKAGED = (): boolean => {
  if (IS_MAIN) {
    return app.isPackaged;
  } else return ipcRenderer.sendSync(IS_PACKAGE_EVENT, []) as boolean;
};

export const IS_DIST_MODE =
  !IS_PACKAGED() && !process.env.ELECTRON_WEBPACK_WDS_PORT;

export const STATIC_PATH = IS_PACKAGED()
  ? __static // prod
  : !process.env.ELECTRON_WEBPACK_WDS_PORT
  ? path.resolve(__dirname, "../../static") // dist / e2e
  : __static; // dev
