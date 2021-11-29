import type {
    AliasMap,
    CommentsMap,
    FilesAndFoldersMap,
    LastModifiedMap,
    VirtualPathToIdMap,
} from "reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { HashesMap } from "reducers/hashes/hashes-types";
import type { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import type { TagMap } from "reducers/tags/tags-types";
import type { ArchifiltreErrorCode } from "util/error/error-codes";
import type { ArchifiltreError } from "util/error/error-util";

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

export type WithIsOnFileSystem<T = {}> = T & {
    isOnFileSystem: boolean;
};

export type WithFilesAndFolders<T = {}> = T & {
    filesAndFolders: FilesAndFoldersMap;
};

export type WithOriginalPath<T = {}> = T & {
    originalPath: string;
};

export type WithElementsToDelete<T = {}> = T & {
    elementsToDelete: string[];
};

export type WithMetadata<T = {}> = T & {
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
};

export type WithAliases<T = {}> = T & {
    aliases: AliasMap;
};

export type WithComments<T = {}> = T & {
    comments: CommentsMap;
};

export type WithHashes<T = {}> = T & {
    hashes: HashesMap;
};

export type WithSessionName<T = {}> = T & {
    sessionName: string;
};

export type WithTags<T = {}> = T & {
    tags: TagMap;
};

export type WithVersion<T = {}> = T & {
    version: string;
};

export type WithVirtualPathToIdMap<T = {}> = T & {
    virtualPathToIdMap: VirtualPathToIdMap;
};

export type WithOverrideLastModified<T = {}> = T & {
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

interface WorkerError {
    code: ArchifiltreErrorCode;
    message: string;
    path: string;
}

interface ErrorData {
    status: FileSystemLoadingStep;
    error: WorkerError;
}

export interface FileSystemReporters {
    reportResult: (result: ResultData) => void;
    reportError: (message: ErrorData) => void;
    reportFatal: (message: any) => void;
}

export type FilesAndFoldersLoader = (
    hooksCreator?: FileSystemLoadingHooksCreator
) => PartialFileSystem | Promise<PartialFileSystem>;

export type WithResultHook<T = {}> = T & {
    onResult: () => void;
};

export type WithErrorHook<T = {}> = T & {
    onError: (error: ArchifiltreError) => void;
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
