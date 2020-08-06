import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { HashesMap } from "reducers/hashes/hashes-types";
import { TagMap } from "reducers/tags/tags-types";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import { ArchifiltreErrorCode } from "util/error/error-util";

export type VirtualFileSystem = WithAliases &
  WithComments &
  WithElementsToDelete &
  WithFilesAndFolders &
  WithMetadata &
  WithHashes &
  WithOriginalPath &
  WithSessionName &
  WithTags &
  WithVersion;

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

export type PartialFileSystem = Partial<VirtualFileSystem> &
  WithFilesAndFolders &
  WithOriginalPath;

export type JsonFileInfo = PartialFileSystem &
  WithSessionName &
  WithAliases &
  WithComments &
  WithHashes &
  WithVersion;

export enum LoadType {
  FILESYSTEM,
  EXPORT_FILE,
  JSON_FILE,
}

type ResultData = {
  status: FileSystemLoadingStep;
  count: number;
  totalCount?: number;
};

type WorkerError = {
  code: ArchifiltreErrorCode;
  message: string;
  path: string;
};

type ErrorData = {
  status: FileSystemLoadingStep;
  error: WorkerError;
};

export type FileSystemReporters = {
  reportResult: (result: ResultData) => void;
  reportError: (message: ErrorData) => void;
  reportFatal: (message: any) => void;
};

export type FilesAndFoldersLoader = (
  hooksCreator?: FileSystemLoadingHooksCreator
) => Promise<PartialFileSystem> | PartialFileSystem;

export type WithResultHook<T = {}> = T & {
  onResult: () => void;
};

export type WithErrorHook<T = {}> = T & {
  onError: (error: WorkerError) => void;
};

export type FileSystemLoadingHooks = {
  onStart: () => void;
  onComplete: () => void;
} & WithResultHook &
  WithErrorHook;

export type FileSystemLoadingHooksCreator = (
  step: FileSystemLoadingStep
) => FileSystemLoadingHooks;

export type FileLoaderCreator = (path: string) => FilesAndFoldersLoader;

export type FileLoaderCreatorMap = {
  [loadType in LoadType]: FileLoaderCreator;
};
