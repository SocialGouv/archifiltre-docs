import { AsyncWorker } from "util/async-worker/async-worker-util";
import { MessageTypes } from "../batch-process/batch-process-util-types";
import {
  fileLoaderCreatorMap,
  getLoadType,
  loadFileSystemFromFilesAndFoldersLoader,
  makeFileLoadingHooksCreator,
} from "files-and-folders-loader/file-system-loading-process-utils";

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

/**
 * Recursively generates a file system from a dropped folder
 * @param asyncWorker
 * @param loadPath
 */
export const loadVirtualFileSystem = async (
  asyncWorker: AsyncWorker,
  loadPath: string
) => {
  const {
    reportResult,
    reportError,
    reportFatal,
    reportComplete,
  } = createReporters(asyncWorker);

  const filesAndFoldersLoadingType = getLoadType(loadPath);

  const filesAndFoldersLoaderCreator =
    fileLoaderCreatorMap[filesAndFoldersLoadingType];

  const filesAndFoldersLoader = filesAndFoldersLoaderCreator(loadPath);

  const hooksCreator = makeFileLoadingHooksCreator({
    reportResult,
    reportError,
    reportFatal,
  });

  const fileSystem = await loadFileSystemFromFilesAndFoldersLoader(
    filesAndFoldersLoader,
    hooksCreator
  );

  reportComplete({
    status: MessageTypes.COMPLETE,
    vfs: fileSystem,
  });
};
