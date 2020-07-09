import { isWindows } from "./os/os-util";

/**
 * Loads the fswin.node module that is copied from the node_modules. A dirty workaround to the fact that
 * we use webpack to build our app so importing native modules is not that simple.
 * We could probably replace this with a proper webpack loader.
 */
const loadFsWin = (): any => {
  if (!isWindows()) {
    return {};
  }
  try {
    // @ts-ignore
    return __non_webpack_require__(
      `./electron/dist/electron/${process.arch}/fswin.node`
    );
  } catch (err) {
    // @ts-ignore
    return __non_webpack_require__(`./electron/${process.arch}/fswin.node`);
  }
};

export default loadFsWin();
