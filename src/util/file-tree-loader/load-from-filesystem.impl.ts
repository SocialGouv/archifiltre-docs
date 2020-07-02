import fs from "fs";
import { hookCounter } from "util/hook/hook-utils";
import { AsyncWorker } from "util/async-worker/async-worker-util";
import { MessageTypes } from "../batch-process/batch-process-util-types";
import {
  createFilesAndFoldersDataStructure,
  createFilesAndFoldersMetadataDataStructure,
  loadFilesAndFoldersFromExportFile,
  loadFilesAndFoldersFromFileSystem,
} from "../../files-and-folders-loader/files-and-folders-loader";
import { HashesMap } from "reducers/hashes/hashes-types";

type Reporter = (message: any) => void;

type Reporters = {
  reportError: Reporter;
  reportWarning: Reporter;
  reportFatal: Reporter;
  reportResult: Reporter;
  reportComplete: Reporter;
};

const createReporters = (asyncWorker: AsyncWorker): Reporters => ({
  reportError: (error: any) =>
    asyncWorker.postMessage({ type: MessageTypes.ERROR, error }),
  reportWarning: (warning: any) =>
    asyncWorker.postMessage({ type: MessageTypes.WARNING, warning }),
  reportFatal: (error: any) =>
    asyncWorker.postMessage({ type: MessageTypes.FATAL, error }),
  reportResult: (result: any) =>
    asyncWorker.postMessage({ type: MessageTypes.RESULT, result }),
  reportComplete: (result: any) =>
    asyncWorker.postMessage({ type: MessageTypes.COMPLETE, result }),
});

const createErrorReportHook = (reportError: Reporter) => (error: any) => {
  if (error) {
    reportError(error);
    return false;
  }
  return true;
};

/**
 * Recursively generates a file system from a dropped folder
 * @param asyncWorker
 * @param folderPath
 */
export const loadFolder = async (
  asyncWorker: AsyncWorker,
  folderPath: string
) => {
  const MIN_MESSAGE_INTERVAL = 300;

  const {
    reportResult,
    reportError,
    reportFatal,
    reportComplete,
    reportWarning,
  } = createReporters(asyncWorker);

  reportResult({ status: "traverse", count: 0 });
  const { hook: traverseHook, getCount: getTraverseCount } = hookCounter(
    (count) => reportResult({ status: "traverse", count }),
    {
      interval: MIN_MESSAGE_INTERVAL,
      internalHook: createErrorReportHook(reportError),
    }
  );
  let origin;
  let hashes: HashesMap | null = null;
  let rootPath: string | null = null;
  try {
    const isExportFile = !fs.statSync(folderPath).isDirectory();
    if (isExportFile) {
      ({
        files: origin,
        hashes,
        rootPath,
      } = await loadFilesAndFoldersFromExportFile(folderPath, traverseHook));
    } else {
      origin = loadFilesAndFoldersFromFileSystem(folderPath, traverseHook);
    }
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
    {
      interval: MIN_MESSAGE_INTERVAL,
      internalHook: createErrorReportHook(reportError),
    }
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
    reportResult({
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
      originalPath: rootPath || folderPath,
      hashes,
    },
  });
};
