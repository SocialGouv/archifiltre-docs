import { IS_DIST_MODE, IS_PACKAGED, RESOURCES_PATH } from "@common/config";
import { isWindows } from "@common/utils/os";
import { type FsWin } from "fswin";
import path from "path";

export const getFsWin = async (): Promise<FsWin> => {
  if (!isWindows() || !process.versions.electron) {
    return {} as FsWin;
  }

  if (!IS_PACKAGED() && !IS_DIST_MODE) {
    return import(`fswin/electron/${process.arch}/fswin.node`);
  }

  const fsWinElectron = path.resolve(`${RESOURCES_PATH}/lib/fswin/electron/${process.arch}/fswin.node`);
  const fsWinNode = path.resolve(`${RESOURCES_PATH}/lib/fswin/node/${process.arch}/fswin.node`);

  // TODO: add custom node-loader working with different entry paths
  // https://github.com/webpack-contrib/node-loader/blob/v1.0.3/src/index.js
  return new Promise((resolve, reject) => {
    try {
      resolve(__non_webpack_require__(fsWinElectron) as FsWin);
    } catch (errorElectron: unknown) {
      try {
        resolve(__non_webpack_require__(fsWinNode) as FsWin);
      } catch (errorNode: unknown) {
        reject(errorNode);
      }
    }
  });
};
