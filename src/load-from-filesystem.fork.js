import * as VirtualFileSystem from "datastore/virtual-file-system";
import { hookCounter } from "./util/hook-utils";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess
} from "./util/async-worker-util";
import { MessageTypes } from "./util/batch-process/batch-process-util-types";
import { loadFilesAndFoldersFromFileSystem } from "./files-and-folders-loader/files-and-folders-loader";

const asyncWorker = createAsyncWorkerForChildProcess();

/**
 * Reports an error to the main thread
 * @param message
 */
const reportError = message => {
  asyncWorker.postMessage({ type: MessageTypes.ERROR, message });
};

/**
 * Reports a warning to the main thread
 * @param message
 */
const reportWarning = message => {
  asyncWorker.postMessage({ type: MessageTypes.WARNING, message });
};

/**
 * Reports a fatal error to the main thread
 * @param message
 */
const reportFatal = message => {
  asyncWorker.postMessage({ type: MessageTypes.FATAL, message });
};

/**
 * Reports a result to the main thread
 * @param message
 */
const reportResult = message => {
  asyncWorker.postMessage({ type: MessageTypes.RESULT, message });
};

/**
 * Reports completion to the main thread
 * @param message
 */
const reportComplete = message => {
  asyncWorker.postMessage({ type: MessageTypes.COMPLETE, message });
};

const errorReportHook = error => {
  if (error) {
    reportError(error);
    return false;
  }
  return true;
};

/**
 * Recursively generates a file system from a dropped folder
 * @param folderPath
 */
function loadFolder(folderPath) {
  const MIN_MESSAGE_INTERVAL = 300;

  reportResult({ status: "traverse", count: 0 });
  const { hook: traverseHook, getCount: getTraverseCount } = hookCounter(
    count => reportResult({ status: "traverse", count }),
    {
      interval: MIN_MESSAGE_INTERVAL,
      internalHook: errorReportHook
    }
  );
  let origin;
  try {
    origin = loadFilesAndFoldersFromFileSystem(folderPath, traverseHook);
  } catch (err) {
    reportFatal(err);
    reportWarning("Error in traverseFileTree");
    return;
  }
  reportResult({ status: "traverse", count: getTraverseCount() });

  const totalMakeCount = getTraverseCount();
  reportResult({
    status: "make",
    count: 0,
    totalCount: totalMakeCount
  });

  const { hook: makeHook, getCount: getMakeCount } = hookCounter(
    count =>
      reportResult({
        status: "make",
        count,
        totalCount: totalMakeCount
      }),
    { interval: MIN_MESSAGE_INTERVAL, internalHook: errorReportHook }
  );
  let vfs;
  try {
    vfs = VirtualFileSystem.make(origin, folderPath, makeHook);
    reportResult({
      status: "make",
      count: getMakeCount(),
      totalCount: totalMakeCount
    });
  } catch (err) {
    reportFatal(err);
    reportWarning("Error in vfs.make");
    return;
  }
  const derivateTotalCount = vfs.get("files_and_folders").count();
  reportResult({
    status: "derivateFF",
    count: 0,
    totalCount: derivateTotalCount
  });

  const derivateThrottledHook = (count, type) => {
    if (type === "reducedFilesAndFolders") {
      reportResult({
        status: "derivateFF",
        count,
        totalCount: derivateTotalCount
      });
    } else if (type === "divedFilesAndFolders") {
      reportResult({
        status: "divedFF",
        count: count - derivateTotalCount,
        totalCount: derivateTotalCount
      });
    }
  };

  const { hook: derivateHook, getCount: getDerivateCount } = hookCounter(
    derivateThrottledHook,
    {
      interval: MIN_MESSAGE_INTERVAL
    }
  );
  try {
    vfs = VirtualFileSystem.derivate(vfs, derivateHook);
    asyncWorker.postMessage({
      status: "divedFF",
      count: getDerivateCount() / 2,
      totalCount: derivateTotalCount
    });
  } catch (error) {
    reportFatal(error);
    reportWarning("Error in vfs.derivate");
  }
  reportComplete({
    status: MessageTypes.COMPLETE,
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
