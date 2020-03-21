import { hookCounter } from "./util/hook-utils";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
} from "./util/async-worker-util";
import { MessageTypes } from "./util/batch-process/batch-process-util-types";
import {
  createFilesAndFoldersDataStructure,
  createFilesAndFoldersMetadataDataStructure,
  loadFilesAndFoldersFromFileSystem,
} from "./files-and-folders-loader/files-and-folders-loader";

const asyncWorker = createAsyncWorkerForChildProcess();

/**
 * Reports an error to the main thread
 * @param message
 */
const reportError = (message) => {
  asyncWorker.postMessage({ type: MessageTypes.ERROR, message });
};

/**
 * Reports a warning to the main thread
 * @param message
 */
const reportWarning = (message) => {
  asyncWorker.postMessage({ type: MessageTypes.WARNING, message });
};

/**
 * Reports a fatal error to the main thread
 * @param message
 */
const reportFatal = (message) => {
  asyncWorker.postMessage({ type: MessageTypes.FATAL, message });
};

/**
 * Reports a result to the main thread
 * @param message
 */
const reportResult = (message) => {
  asyncWorker.postMessage({ type: MessageTypes.RESULT, message });
};

/**
 * Reports completion to the main thread
 * @param message
 */
const reportComplete = (message) => {
  asyncWorker.postMessage({ type: MessageTypes.COMPLETE, message });
};

const errorReportHook = (error) => {
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
    (count) => reportResult({ status: "traverse", count }),
    {
      interval: MIN_MESSAGE_INTERVAL,
      internalHook: errorReportHook,
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
    totalCount: totalMakeCount,
  });

  const { hook: makeHook, getCount: getMakeCount } = hookCounter(
    (count) =>
      reportResult({
        status: "make",
        count,
        totalCount: totalMakeCount,
      }),
    { interval: MIN_MESSAGE_INTERVAL, internalHook: errorReportHook }
  );
  let filesAndFolders;
  try {
    filesAndFolders = createFilesAndFoldersDataStructure(origin, makeHook);
    reportResult({
      status: "make",
      count: getMakeCount(),
      totalCount: totalMakeCount,
    });
  } catch (err) {
    reportFatal(err);
    reportWarning("Error in vfs.make");
    return;
  }
  const derivateTotalCount = Object.keys(filesAndFolders).length;
  reportResult({
    status: "derivateFF",
    count: 0,
    totalCount: derivateTotalCount,
  });

  let filesAndFoldersMetadata;
  try {
    filesAndFoldersMetadata = createFilesAndFoldersMetadataDataStructure(
      filesAndFolders
    );
    asyncWorker.postMessage({
      status: "divedFF",
      count: Object.keys(filesAndFolders).length,
      totalCount: derivateTotalCount,
    });
  } catch (error) {
    reportFatal(error);
    reportWarning("Error in vfs.derivate");
  }
  reportComplete({
    status: MessageTypes.COMPLETE,
    vfs: {
      filesAndFolders,
      filesAndFoldersMetadata,
      originalPath: folderPath,
    },
  });
}

asyncWorker.addEventListener(
  AsyncWorkerEvent.MESSAGE,
  ({ droppedElementPath }) => {
    loadFolder(droppedElementPath);
  }
);

export default {};
