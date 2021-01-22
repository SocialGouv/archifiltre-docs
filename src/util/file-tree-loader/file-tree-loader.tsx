import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import { Observable } from "rxjs";
import { cancelableBackgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { ArchifiltreError } from "util/error/error-util";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";
import { Readable } from "stream";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { parseVFSFromStream } from "util/file-tree-loader/load-from-filesystem-serializer";

type LoadFileTreeResponse = { result$: Observable<any>; terminate: () => void };

export type HookParam = {
  status?: string | FileSystemLoadingStep;
  count?: number;
  totalCount?: number;
  vfs?: VirtualFileSystem;
};

type LoadFileTreeParams = {
  filesAndFolders?: FilesAndFoldersMap;
  erroredPaths?: ArchifiltreError[];
};

type StreamParserResult = {
  status: MessageTypes;
  result: VirtualFileSystem;
};

const streamParser = async (stream: Readable): Promise<StreamParserResult> => {
  const vfs = await parseVFSFromStream(stream);
  return { status: MessageTypes.RESULT, result: vfs };
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
