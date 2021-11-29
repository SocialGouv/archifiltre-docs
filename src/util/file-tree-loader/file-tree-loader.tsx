import type { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import type { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import type { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import type { Observable } from "rxjs";
import type { Readable } from "stream";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";
import { cancelableBackgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import type { ArchifiltreError } from "util/error/error-util";
import { parseVFSFromStream } from "util/file-tree-loader/load-from-filesystem-serializer";

interface LoadFileTreeResponse {
    result$: Observable<any>;
    terminate: () => void;
}

export interface HookParam {
    status?: FileSystemLoadingStep | string;
    count?: number;
    totalCount?: number;
    vfs?: VirtualFileSystem;
}

interface LoadFileTreeParams {
    filesAndFolders?: FilesAndFoldersMap;
    erroredPaths?: ArchifiltreError[];
}

interface StreamParserResult {
    status: MessageTypes;
    result: VirtualFileSystem;
}

const streamParser = async (stream: Readable): Promise<StreamParserResult> => {
    const vfs = await parseVFSFromStream(stream);
    return { result: vfs, status: MessageTypes.RESULT };
};

export const loadFileTree = (
    droppedElementPath: string,
    params: LoadFileTreeParams
): LoadFileTreeResponse =>
    cancelableBackgroundWorkerProcess$(
        {
            path: droppedElementPath,
            ...params,
        },
        createAsyncWorkerForChildProcessControllerFactory<StreamParserResult>(
            "load-from-filesystem.fork",
            {
                dataStreamProcessor: streamParser,
            }
        )
    );
