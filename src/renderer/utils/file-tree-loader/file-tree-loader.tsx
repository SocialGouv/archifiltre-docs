import { type ArchifiltreDocsError } from "@common/utils/error";
import { type Observable } from "rxjs";
import { type Readable } from "stream";

import { type VirtualFileSystem } from "../../files-and-folders-loader/files-and-folders-loader-types";
import { type FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { type FileSystemLoadingStep } from "../../reducers/loading-state/loading-state-types";
import { createAsyncWorkerForChildProcessControllerFactory } from "../async-worker/child-process";
import { cancelableBackgroundWorkerProcess$ } from "../batch-process";
import { type ErrorMessage, MessageTypes, type ResultMessage } from "../batch-process/types";
import { parseVFSFromStream } from "./load-from-filesystem-serializer";

interface LoadFileTreeResponse {
  result$: Observable<ErrorMessage | ResultMessage<{ result: unknown }>>;
  terminate: () => void;
}

export interface HookParam {
  count?: number;
  status?: FileSystemLoadingStep | string;
  totalCount?: number;
  vfs?: VirtualFileSystem;
}

interface LoadFileTreeParams {
  erroredPaths?: ArchifiltreDocsError[];
  filesAndFolders?: FilesAndFoldersMap;
}

interface StreamParserResult {
  result: VirtualFileSystem;
  status: MessageTypes;
}

const streamParser = async (stream: Readable): Promise<StreamParserResult> => {
  const vfs = await parseVFSFromStream(stream);
  return { result: vfs, status: MessageTypes.RESULT };
};

export const loadFileTree = (droppedElementPath: string, params: LoadFileTreeParams): LoadFileTreeResponse =>
  cancelableBackgroundWorkerProcess$(
    {
      path: droppedElementPath,
      ...params,
    },
    createAsyncWorkerForChildProcessControllerFactory<StreamParserResult>(
      "utils/file-tree-loader/load-from-filesystem.fork.ts",
      {
        dataStreamProcessor: streamParser,
      },
    ),
  );
