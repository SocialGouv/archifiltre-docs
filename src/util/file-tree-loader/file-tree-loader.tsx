import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import { Observable } from "rxjs";
import { cancelableBackgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import LoadFromFileSystemWorker from "./load-from-filesystem.fork";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";

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

export const loadFileTree = (
  droppedElementPath: string,
  params: LoadFileTreeParams
): LoadFileTreeResponse =>
  cancelableBackgroundWorkerProcess$(
    { path: droppedElementPath, ...params },
    LoadFromFileSystemWorker
  );
