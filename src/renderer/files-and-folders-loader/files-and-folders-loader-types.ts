import type { WorkerError } from "@common/types";
import type { ArchifiltreDocsError } from "@common/utils/error";
import type { HashesMap } from "@common/utils/hashes-types";
import type { SimpleObject } from "@common/utils/object";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
  LastModifiedMap,
  VirtualPathToIdMap,
} from "../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { FileSystemLoadingStep } from "../reducers/loading-state/loading-state-types";
import type { TagMap } from "../reducers/tags/tags-types";

export type VirtualFileSystem = WithAliases &
  WithComments &
  WithElementsToDelete &
  WithFilesAndFolders &
  WithHashes &
  WithIsOnFileSystem &
  WithMetadata &
  WithOriginalPath &
  WithOverrideLastModified &
  WithSessionName &
  WithTags &
  WithVersion &
  WithVirtualPathToIdMap;

export type WithIsOnFileSystem<T = SimpleObject> = T & {
  isOnFileSystem: boolean;
};

export type WithFilesAndFolders<T = SimpleObject> = T & {
  filesAndFolders: FilesAndFoldersMap;
};

export type WithOriginalPath<T = SimpleObject> = T & {
  originalPath: string;
};

export type WithElementsToDelete<T = SimpleObject> = T & {
  elementsToDelete: string[];
};

export type WithMetadata<T = SimpleObject> = T & {
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
};

export type WithAliases<T = SimpleObject> = T & {
  aliases: AliasMap;
};

export type WithComments<T = SimpleObject> = T & {
  comments: CommentsMap;
};

export type WithHashes<T = SimpleObject> = T & {
  hashes: HashesMap;
};

export type WithSessionName<T = SimpleObject> = T & {
  sessionName: string;
};

export type WithTags<T = SimpleObject> = T & {
  tags: TagMap;
};

export type WithVersion<T = SimpleObject> = T & {
  version: string;
};

export type WithVirtualPathToIdMap<T = SimpleObject> = T & {
  virtualPathToIdMap: VirtualPathToIdMap;
};

export type WithOverrideLastModified<T = SimpleObject> = T & {
  overrideLastModified: LastModifiedMap;
};

export type PartialFileSystem = Partial<VirtualFileSystem> &
  WithFilesAndFolders &
  WithOriginalPath;

export type JsonFileInfo = PartialFileSystem &
  WithAliases &
  WithComments &
  WithHashes &
  WithOverrideLastModified &
  WithSessionName &
  WithVersion &
  WithVirtualPathToIdMap;

interface ResultData {
  status: FileSystemLoadingStep;
  count: number;
  totalCount?: number;
}

export interface ErrorData {
  status: FileSystemLoadingStep;
  error: WorkerError;
}

export interface FileSystemReporters {
  reportResult: (result: ResultData) => void;
  reportError: (message: ErrorData) => void;
  reportFatal: (message: unknown) => void;
}

export type FilesAndFoldersLoader = (
  hooksCreator?: FileSystemLoadingHooksCreator
) => PartialFileSystem | Promise<PartialFileSystem>;

export type WithResultHook<T = SimpleObject> = T & {
  onResult: () => void;
};

export type WithErrorHook<T = SimpleObject> = T & {
  onError: (error: ArchifiltreDocsError) => void;
};

export type FileSystemLoadingHooks = WithErrorHook &
  WithResultHook & {
    onStart: () => void;
    onComplete: () => void;
  };

export type FileSystemLoadingHooksCreator = (
  step: FileSystemLoadingStep
) => FileSystemLoadingHooks;

export type FileLoaderCreator = (path: string) => FilesAndFoldersLoader;
