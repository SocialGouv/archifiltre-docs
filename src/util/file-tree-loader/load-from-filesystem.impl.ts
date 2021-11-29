import {
    getLoader,
    isFileSystemLoad,
    loadFileSystemFromFilesAndFoldersLoader,
    makeFileLoadingHooksCreator,
} from "files-and-folders-loader/file-system-loading-process-utils";
import * as fs from "fs";
import type { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import type { AsyncWorker } from "util/async-worker/async-worker-util";
import { WorkerEventType } from "util/async-worker/async-worker-util";
import { RESULT_STREAM_FILE_DESCRIPTOR } from "util/async-worker/child-process";
import type { ArchifiltreError } from "util/error/error-util";
import { stringifyVFSToStream } from "util/file-tree-loader/load-from-filesystem-serializer";

import { MessageTypes } from "../batch-process/batch-process-util-types";

type Reporter = (message: any) => void;

interface Reporters {
    reportError: Reporter;
    reportWarning: Reporter;
    reportFatal: Reporter;
    reportResult: Reporter;
    reportComplete: Reporter;
}

const createReporters = (asyncWorker: AsyncWorker): Reporters => ({
    reportComplete: () =>
        asyncWorker.postMessage({ type: MessageTypes.COMPLETE }),
    reportError: (error: any) =>
        asyncWorker.postMessage({ error, type: MessageTypes.ERROR }),
    reportFatal: (error: any) =>
        asyncWorker.postMessage({ error, type: MessageTypes.FATAL }),
    reportResult: (result: any) =>
        asyncWorker.postMessage({ result, type: MessageTypes.RESULT }),
    reportWarning: (warning: any) =>
        asyncWorker.postMessage({ type: MessageTypes.WARNING, warning }),
});

const reportResultStream = async (result: any) => {
    // @ts-expect-error
    const stream = fs.createWriteStream(null, {
        fd: RESULT_STREAM_FILE_DESCRIPTOR,
    });
    stringifyVFSToStream(stream, result);
};

interface LoadVirtualFileSystemParams {
    path: string;
    filesAndFolders?: FilesAndFoldersMap;
    erroredPaths?: ArchifiltreError[];
}

/**
 * Recursively generates a file system from a dropped folder
 * @param asyncWorker
 * @param loadPath
 */
export const loadVirtualFileSystem = async (
    asyncWorker: AsyncWorker,
    { path, filesAndFolders, erroredPaths }: LoadVirtualFileSystemParams
) => {
    const { reportResult, reportError, reportFatal, reportComplete } =
        createReporters(asyncWorker);

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
