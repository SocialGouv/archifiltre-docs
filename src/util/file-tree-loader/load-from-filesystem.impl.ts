import {
  AsyncWorker,
  WorkerEventType,
} from "util/async-worker/async-worker-util";
import { MessageTypes } from "../batch-process/batch-process-util-types";
import {
  getLoader,
  isFileSystemLoad,
  loadFileSystemFromFilesAndFoldersLoader,
  makeFileLoadingHooksCreator,
} from "files-and-folders-loader/file-system-loading-process-utils";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { ArchifiltreError } from "util/error/error-util";
import * as fs from "fs";
import { stringifyVFSToStream } from "util/file-tree-loader/load-from-filesystem-serializer";
import { RESULT_STREAM_FILE_DESCRIPTOR } from "util/async-worker/child-process";

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

const reportResultStream = async (result: any) => {
  // @ts-ignore
  const stream = fs.createWriteStream(null, {
    fd: RESULT_STREAM_FILE_DESCRIPTOR,
  });
  stringifyVFSToStream(stream, result);
};

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

  const isOnFileSystem = isFileSystemLoad(path);

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
    hooksCreator,
    {
      isOnFileSystem,
    }
  );

  await reportResultStream(fileSystem);

  await new Promise<void>((resolve) =>
    asyncWorker.addEventListener(WorkerEventType.MESSAGE, ({ type }) => {
      if (type === MessageTypes.STREAM_READ) {
        resolve();
      }
    })
  );

  reportComplete({
    status: MessageTypes.COMPLETE,
  });
};
