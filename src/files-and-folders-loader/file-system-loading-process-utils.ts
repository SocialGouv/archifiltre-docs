import fs from "fs";
import _, { noop } from "lodash";
import { compose, defaults } from "lodash/fp";

import { isFile } from "../reducers/files-and-folders/files-and-folders-selectors";
import type {
  FilesAndFoldersMap,
  LastModifiedMap,
} from "../reducers/files-and-folders/files-and-folders-types";
import { createFilesAndFoldersMetadata } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FileSystemLoadingStep } from "../reducers/loading-state/loading-state-types";
import { medianOnSortedArray } from "../util/array/array-util";
import type { ArchifiltreError } from "../util/error/error-util";
import { isJsonFile } from "../util/file-system/file-sys-util";
import { tap } from "../util/functionnal-programming-utils";
import { hookCounter } from "../util/hook/hook-utils";
import { indexSort, indexSortReverse } from "../util/list-util";
import { version } from "../version";
import {
  asyncLoadFilesAndFoldersFromFileSystem,
  makeExportFileLoader,
  makeFileSystemLoader,
  makeJsonFileLoader,
  retryLoadFromFileSystem,
} from "./files-and-folders-loader";
import type {
  FileLoaderCreator,
  FilesAndFoldersLoader,
  FileSystemLoadingHooks,
  FileSystemLoadingHooksCreator,
  FileSystemReporters,
  PartialFileSystem,
  VirtualFileSystem,
  WithMetadata,
  WithResultHook,
  WorkerError,
} from "./files-and-folders-loader-types";

interface Overrides {
  lastModified?: LastModifiedMap;
}

/**
 * Compute the metadata from the filesAndFoldersMap
 */
export const createFilesAndFoldersMetadataDataStructure = (
  filesAndFoldersMap: FilesAndFoldersMap,
  { onResult = noop }: Partial<WithResultHook> = {},
  { lastModified = {} }: Overrides = {}
): FilesAndFoldersMetadataMap => {
  const metadata: FilesAndFoldersMetadataMap = {};
  const lastModifiedLists: Record<string, number[]> = {};
  const initialLastModifiedLists: Record<string, number[]> = {};

  const computeMetadataRec = (id: string) => {
    const element = filesAndFoldersMap[id];
    onResult();
    if (isFile(element)) {
      const fileLastModified =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        lastModified[id] !== undefined
          ? lastModified[id]
          : element.file_last_modified;
      metadata[id] = createFilesAndFoldersMetadata({
        averageLastModified: fileLastModified,
        childrenTotalSize: element.file_size,
        initialMaxLastModified: element.file_last_modified,
        initialMedianLastModified: element.file_last_modified,
        initialMinLastModified: element.file_last_modified,
        maxLastModified: fileLastModified,
        medianLastModified: fileLastModified,
        minLastModified: fileLastModified,
        nbChildrenFiles: 1,
        sortAlphaNumericallyIndex: [],
        sortByDateIndex: [],
        sortBySizeIndex: [],
      });
      lastModifiedLists[id] = [fileLastModified];
      initialLastModifiedLists[id] = [element.file_last_modified];
      return;
    }

    element.children.forEach((childId) => {
      computeMetadataRec(childId);
    });

    lastModifiedLists[id] = _(element.children)
      .map((childId) => lastModifiedLists[childId])
      .flatten()
      .sortBy()
      .value();

    initialLastModifiedLists[id] = _(element.children)
      .map((childId) => initialLastModifiedLists[childId])
      .flatten()
      .sortBy()
      .value();

    const childrenTotalSize = _.sum(
      element.children.map((childId) => metadata[childId].childrenTotalSize)
    );
    const averageLastModified = _.mean(lastModifiedLists[id]);
    const medianLastModified = medianOnSortedArray(lastModifiedLists[id]);
    const maxLastModified =
      lastModifiedLists[id][lastModifiedLists[id].length - 1];
    const minLastModified = lastModifiedLists[id][0];

    const initialMedianLastModified = medianOnSortedArray(
      initialLastModifiedLists[id]
    );
    const initialMaxLastModified =
      initialLastModifiedLists[id][initialLastModifiedLists[id].length - 1];
    const initialMinLastModified = initialLastModifiedLists[id][0];

    const nbChildrenFiles = _.sum(
      element.children.map((childId) => metadata[childId].nbChildrenFiles)
    );
    const sortByDateIndex = indexSort(
      (childId: string) => metadata[childId].averageLastModified,
      element.children
    );

    const sortBySizeIndex = indexSortReverse(
      (childId: string) => metadata[childId].childrenTotalSize,
      element.children
    );

    const sortAlphaNumericallyIndex = indexSort(
      (childId: string) => filesAndFoldersMap[childId].name,
      element.children
    );

    metadata[id] = createFilesAndFoldersMetadata({
      averageLastModified,
      childrenTotalSize,
      initialMaxLastModified,
      initialMedianLastModified,
      initialMinLastModified,
      maxLastModified,
      medianLastModified,
      minLastModified,
      nbChildrenFiles,
      sortAlphaNumericallyIndex,
      sortByDateIndex,
      sortBySizeIndex,
    });
  };

  computeMetadataRec("");

  return metadata;
};

/**
 * Handles hook generation when hooksCreator is undefined
 */
export const sanitizeHooks =
  (hooksCreator?: FileSystemLoadingHooksCreator) =>
  (step: FileSystemLoadingStep): FileSystemLoadingHooks =>
    hooksCreator
      ? hooksCreator(step)
      : {
          onComplete: noop,
          onError: noop,
          onResult: noop,
          onStart: noop,
        };

/**
 * Generic function to load the app based on a loader for a specific file type.
 */
export const loadFileSystemFromFilesAndFoldersLoader = async (
  loadFromSource: FilesAndFoldersLoader,
  hooksCreator?: FileSystemLoadingHooksCreator,
  overrides?: {
    isOnFileSystem: boolean;
  }
): Promise<VirtualFileSystem> => {
  const baseFileSystem = await loadFromSource(hooksCreator);

  const metadataHooks = sanitizeHooks(hooksCreator)(
    FileSystemLoadingStep.METADATA
  );

  return compose<
    [PartialFileSystem],
    PartialFileSystem,
    WithMetadata<PartialFileSystem>,
    WithMetadata<PartialFileSystem>,
    VirtualFileSystem
  >(
    defaults({
      aliases: {},
      comments: {},
      elementsToDelete: [],
      hashes: {},
      isOnFileSystem: Boolean(overrides?.isOnFileSystem),
      overrideLastModified: {},
      sessionName: "",
      tags: {},
      version,
      virtualPathToIdMap: {},
    }),
    tap(() => {
      metadataHooks.onComplete();
    }),
    (
      partialFileSystem: PartialFileSystem
    ): WithMetadata<PartialFileSystem> => ({
      ...partialFileSystem,
      filesAndFoldersMetadata: createFilesAndFoldersMetadataDataStructure(
        partialFileSystem.filesAndFolders,
        metadataHooks
      ),
    }),
    tap(() => {
      metadataHooks.onStart();
    })
  )(baseFileSystem);
};

/**
 * Check if the element needs to be loaded with the file system loader
 */
export const isFileSystemLoad = (loadPath: string): boolean =>
  fs.statSync(loadPath).isDirectory();

/**
 * Check if the element needs to be loaded with the JsonLoader
 */
const isJsonLoad = (loadPath: string) => isJsonFile(loadPath);

interface GetLoadTypeOptions {
  filesAndFolders?: FilesAndFoldersMap;
  erroredPaths?: ArchifiltreError[];
}

/**
 * Return the load type required to load the element located at loadPath
 */
export const getLoader = (
  loadPath: string,
  { filesAndFolders, erroredPaths }: GetLoadTypeOptions = {}
): FileLoaderCreator => {
  if (isFileSystemLoad(loadPath)) {
    if (filesAndFolders && erroredPaths) {
      const paths = erroredPaths.map(({ filePath }) => filePath);
      return makeFileSystemLoader(
        retryLoadFromFileSystem({
          erroredPaths: paths,
          filesAndFolders,
        })
      );
    }
    return makeFileSystemLoader(asyncLoadFilesAndFoldersFromFileSystem);
  }

  if (isJsonLoad(loadPath)) {
    return makeJsonFileLoader;
  }

  return makeExportFileLoader;
};

/**
 * Generate a function that creates the hooks for a specific laoding step.
 */
export const makeFileLoadingHooksCreator =
  ({ reportResult, reportError }: FileSystemReporters) =>
  (step: FileSystemLoadingStep): FileSystemLoadingHooks => {
    const resultReporter = (count?: number) => {
      if (count) {
        reportResult({
          count: count,
          status: step,
        });
      }
    };

    const { hook: onResult, getCount: getResultCount } =
      hookCounter(resultReporter);

    const onStart = () => {
      resultReporter(0);
    };
    const onComplete = () => {
      resultReporter(getResultCount());
    };
    const onError = (error: unknown) => {
      reportError({
        error: error as WorkerError,
        status: step,
      });
    };

    return {
      onComplete,
      onError,
      onResult,
      onStart,
    };
  };
