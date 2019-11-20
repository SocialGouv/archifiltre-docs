import { traverseFileTree } from "util/file-sys-util";

import * as VirtualFileSystem from "datastore/virtual-file-system";
import { reportError, reportMessage } from "./logging/reporter";
import { hookCounter } from "./util/hook-utils";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess
} from "./util/async-worker-util";

const asyncWorker = createAsyncWorkerForChildProcess();

/**
 * Recursively generates a file system from a dropped folder
 * @param folderPath
 */
function loadFolder(folderPath) {
  const MIN_MESSAGE_INTERVAL = 300;

  asyncWorker.postMessage({ status: "traverse", count: 0 });
  const { hook: traverseHook, getCount: getTraverseCount } = hookCounter(
    count => asyncWorker.postMessage({ status: "traverse", count }),
    {
      interval: MIN_MESSAGE_INTERVAL
    }
  );
  let origin;
  try {
    [, origin] = traverseFileTree(traverseHook, folderPath);
  } catch (err) {
    reportError(err);
    reportMessage("Error in traverseFileTree");
    asyncWorker.postMessage({ status: "error", message: err.message });
    return;
  }
  asyncWorker.postMessage({ status: "traverse", count: getTraverseCount() });

  const totalMakeCount = getTraverseCount();
  asyncWorker.postMessage({
    status: "make",
    count: 0,
    totalCount: totalMakeCount
  });

  const { hook: makeHook, getCount: getMakeCount } = hookCounter(
    count =>
      asyncWorker.postMessage({
        status: "make",
        count,
        totalCount: totalMakeCount
      }),
    { interval: MIN_MESSAGE_INTERVAL }
  );
  let vfs;
  try {
    vfs = VirtualFileSystem.make(origin, folderPath, makeHook);
    asyncWorker.postMessage({
      status: "make",
      count: getMakeCount(),
      totalCount: totalMakeCount
    });
  } catch (err) {
    reportError(err);
    reportMessage("Error in vfs.make");
    asyncWorker.postMessage({ status: "error", message: err.message });
    return;
  }
  const derivateTotalCount = vfs.get("files_and_folders").count();
  asyncWorker.postMessage({
    status: "derivateFF",
    count: 0,
    totalCount: derivateTotalCount
  });

  const derivateThrottledHook = (count, type) => {
    if (type === "reducedFilesAndFolders") {
      asyncWorker.postMessage({
        status: "derivateFF",
        count,
        totalCount: derivateTotalCount
      });
    } else if (type === "divedFilesAndFolders") {
      asyncWorker.postMessage({
        status: "divedFF",
        count: count - derivateTotalCount,
        totalCount: derivateTotalCount
      });
    }
  };

  const {
    hook: derivateHook,
    getCount: getDerivateCount
  } = hookCounter(derivateThrottledHook, { interval: MIN_MESSAGE_INTERVAL });
  try {
    vfs = VirtualFileSystem.derivate(vfs, derivateHook);
    asyncWorker.postMessage({
      status: "divedFF",
      count: getDerivateCount() / 2,
      totalCount: derivateTotalCount
    });
  } catch (error) {
    reportError(error);
    reportMessage("Error in vfs.derivate");
    asyncWorker.postMessage({ status: "error", message: error.message });
  }
  asyncWorker.postMessage({
    status: "return",
    vfs: VirtualFileSystem.toJs(vfs)
  });
}

asyncWorker.addEventListener(
  AsyncWorkerEvent.MESSAGE,
  ({ droppedElementPath }) => {
    loadFolder(droppedElementPath);
  }
);

export default {};
