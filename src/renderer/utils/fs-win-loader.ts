/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { isWindows } from "@common/utils/os";

// TODO: replace

/**
 * Loads the fswin.node module that is copied from the node_modules. A dirty workaround to the fact that
 * we use webpack to build our app so importing native modules is not that simple.
 * We could probably replace this with a proper webpack loader.
 */
export const fswin: FsWin = (() => {
  if (!isWindows()) {
    return {};
  }
  try {
    // @ts-expect-error
    return __non_webpack_require__(
      `./dist/electron/${process.arch}/fswin.node`
    );
  } catch (err: unknown) {
    // @ts-expect-error
    return __non_webpack_require__(`./electron/${process.arch}/fswin.node`);
  }
})();

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace FsWin {
  export interface Attributes {
    readonly IS_HIDDEN: boolean;
  }
}
interface FsWin {
  getAttributesSync: (path: string) => FsWin.Attributes;
  getAttributes: (
    path: string,
    cb: (attributes?: FsWin.Attributes) => void
  ) => void;
}
