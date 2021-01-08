import { AsyncWorker } from "util/async-worker/async-worker-util";
import { MessageTypes } from "../batch-process/batch-process-util-types";
import {
  getLoader,
  loadFileSystemFromFilesAndFoldersLoader,
  makeFileLoadingHooksCreator,
} from "files-and-folders-loader/file-system-loading-process-utils";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { ArchifiltreError } from "util/error/error-util";

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
  reportComplete: () =>
    asyncWorker.postMessage({ type: MessageTypes.COMPLETE }),
});

type LoadVirtualFileSystemParams = {
  path: string;
  filesAndFolders?: FilesAndFoldersMap;
  erroredPaths?: ArchifiltreError[];
};

/**
 * Recursively generates a file system from a dropped folder
 * @param asyncWorker
 * @param loadPath
 */
export const loadVirtualFileSystem = async (
  asyncWorker: AsyncWorker,
  { path, filesAndFolders, erroredPaths }: LoadVirtualFileSystemParams
) => {
  const {
    reportResult,
    reportError,
    reportFatal,
    reportComplete,
  } = createReporters(asyncWorker);

  const filesAndFoldersLoaderCreator = getLoader(path, {
    filesAndFolders,
    erroredPaths,
  });

  const filesAndFoldersLoader = filesAndFoldersLoaderCreator(path);

  const hooksCreator = makeFileLoadingHooksCreator({
    reportResult,
    reportError,
    reportFatal,
  });

  const fileSystem = await loadFileSystemFromFilesAndFoldersLoader(
    filesAndFoldersLoader,
    hooksCreator
  );

  reportResult({ status: MessageTypes.RESULT, result: fileSystem });

  reportComplete({
    status: MessageTypes.COMPLETE,
  });
};
