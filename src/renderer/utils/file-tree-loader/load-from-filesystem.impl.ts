import { type ArchifiltreDocsError } from "@common/utils/error";
import * as fs from "fs";

import {
  getLoader,
  isFileSystemLoad,
  loadFileSystemFromFilesAndFoldersLoader,
  makeFileLoadingHooksCreator,
} from "../../files-and-folders-loader/file-system-loading-process-utils";
import { type VirtualFileSystem } from "../../files-and-folders-loader/files-and-folders-loader-types";
import { type FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { type AsyncWorker, WorkerEventType } from "../async-worker";
import { RESULT_STREAM_FILE_DESCRIPTOR } from "../async-worker/child-process";
import { MessageTypes } from "../batch-process/types";
import { stringifyVFSToStream } from "./load-from-filesystem-serializer";

type Reporter = (message: unknown) => void;

interface Reporters {
  reportComplete: Reporter;
  reportError: Reporter;
  reportFatal: Reporter;
  reportResult: Reporter;
  reportWarning: Reporter;
}

const createReporters = (asyncWorker: AsyncWorker): Reporters => ({
  reportComplete: () => {
    asyncWorker.postMessage({ type: MessageTypes.COMPLETE });
  },
  reportError: (error: unknown) => {
    asyncWorker.postMessage({ error, type: MessageTypes.ERROR });
  },
  reportFatal: (error: unknown) => {
    asyncWorker.postMessage({ error, type: MessageTypes.FATAL });
  },
  reportResult: (result: unknown) => {
    asyncWorker.postMessage({ result, type: MessageTypes.RESULT });
  },
  reportWarning: (warning: unknown) => {
    asyncWorker.postMessage({ type: MessageTypes.WARNING, warning });
  },
});

const reportResultStream = (result: VirtualFileSystem) => {
  // @ts-expect-error Create a stream is touchy (?)
  const stream = fs.createWriteStream(null, {
    fd: RESULT_STREAM_FILE_DESCRIPTOR,
  });
  stringifyVFSToStream(stream, result);
};

interface LoadVirtualFileSystemParams {
  erroredPaths?: ArchifiltreDocsError[];
  filesAndFolders?: FilesAndFoldersMap;
  path: string;
}

/**
 * Recursively generates a file system from a dropped folder
 * @param asyncWorker
 * @param loadPath
 */
export const loadVirtualFileSystem = async (
  asyncWorker: AsyncWorker,
  { path, filesAndFolders, erroredPaths }: LoadVirtualFileSystemParams,
): Promise<void> => {
  const { reportResult, reportError, reportFatal, reportComplete } = createReporters(asyncWorker);

  const isOnFileSystem = isFileSystemLoad(path);

  const filesAndFoldersLoaderCreator = getLoader(path, {
    erroredPaths,
    filesAndFolders,
  });

  const filesAndFoldersLoader = filesAndFoldersLoaderCreator(path);

  const hooksCreator = makeFileLoadingHooksCreator({
    reportError,
    reportFatal,
    reportResult,
  });

  const fileSystem = await loadFileSystemFromFilesAndFoldersLoader(filesAndFoldersLoader, hooksCreator, {
    isOnFileSystem,
  });

  reportResultStream(fileSystem);

  await new Promise<void>(resolve => {
    asyncWorker.addEventListener(WorkerEventType.MESSAGE, ({ type }) => {
      if (type === MessageTypes.STREAM_READ) {
        resolve();
      }
    });
  });

  reportComplete({
    status: MessageTypes.COMPLETE,
  });
};
