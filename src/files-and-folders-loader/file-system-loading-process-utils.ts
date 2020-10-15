import { isJsonFile } from "util/file-system/file-sys-util";
import {
  FileLoaderCreator,
  FilesAndFoldersLoader,
  FileSystemLoadingHooks,
  FileSystemLoadingHooksCreator,
  FileSystemReporters,
  PartialFileSystem,
  VirtualFileSystem,
  WithMetadata,
  WithResultHook,
} from "files-and-folders-loader/files-and-folders-loader-types";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import { compose, defaults } from "lodash/fp";
import version from "version";
import { tap } from "util/functionnal-programming-utils";
import fs from "fs";
import { hookCounter } from "util/hook/hook-utils";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { empty } from "util/function/function-util";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import _ from "lodash";
import { medianOnSortedArray } from "util/array/array-util";
import { indexSort, indexSortReverse } from "util/list-util";
import {
  asyncLoadFilesAndFoldersFromFileSystem,
  makeExportFileLoader,
  makeFileSystemLoader,
  makeJsonFileLoader,
  retryLoadFromFileSystem,
} from "files-and-folders-loader/files-and-folders-loader";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";

/**
 * Compute the metadata from the filesAndFoldersMap
 * @param filesAndFoldersMap
 * @param onResult - Hook called after a new metadata is computed
 */
export const createFilesAndFoldersMetadataDataStructure = (
  filesAndFoldersMap: FilesAndFoldersMap,
  { onResult }: WithResultHook = {
    onResult: empty,
  }
): FilesAndFoldersMetadataMap => {
  const metadata: FilesAndFoldersMetadataMap = {};
  const lastModifiedLists = {};

  const computeMetadataRec = (id) => {
    const element = filesAndFoldersMap[id];
    onResult();
    if (isFile(element)) {
      metadata[id] = {
        averageLastModified: element.file_last_modified,
        childrenTotalSize: element.file_size,
        maxLastModified: element.file_last_modified,
        medianLastModified: element.file_last_modified,
        minLastModified: element.file_last_modified,
        nbChildrenFiles: 1,
        sortByDateIndex: [],
        sortBySizeIndex: [],
        sortAlphaNumericallyIndex: [],
      };
      lastModifiedLists[id] = [element.file_last_modified];
      return;
    }

    element.children.forEach((childId) => computeMetadataRec(childId));

    lastModifiedLists[id] = _(element.children)
      .map((childId) => lastModifiedLists[childId])
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

    metadata[id] = {
      averageLastModified,
      childrenTotalSize,
      maxLastModified,
      medianLastModified,
      minLastModified,
      nbChildrenFiles,
      sortByDateIndex,
      sortBySizeIndex,
      sortAlphaNumericallyIndex,
    };
  };

  computeMetadataRec("");

  return metadata;
};

/**
 * Handles hook generation when hooksCreator is undefined
 * @param hooksCreator
 */
export const sanitizeHooks = (hooksCreator?: FileSystemLoadingHooksCreator) => (
  step: FileSystemLoadingStep
): FileSystemLoadingHooks =>
  hooksCreator
    ? hooksCreator(step)
    : {
        onStart: empty,
        onResult: empty,
        onError: empty,
        onComplete: empty,
      };

/**
 * Generic function to load the app based on a loader for a specific file type.
 * @param loadFromSource
 * @param hooksCreator
 */
export const loadFileSystemFromFilesAndFoldersLoader = async (
  loadFromSource: FilesAndFoldersLoader,
  hooksCreator?: FileSystemLoadingHooksCreator
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
      sessionName: "",
      tags: {},
      version,
      virtualPathToIdMap: {},
    }),
    tap(() => metadataHooks.onComplete()),
    (
      partialFileSystem: PartialFileSystem
    ): WithMetadata<PartialFileSystem> => ({
      ...partialFileSystem,
      filesAndFoldersMetadata: createFilesAndFoldersMetadataDataStructure(
        partialFileSystem.filesAndFolders,
        metadataHooks
      ),
    }),
    tap(() => metadataHooks.onStart())
  )(baseFileSystem);
};

/**
 * Check if the element needs to be loaded with the file system loader
 * @param loadPath
 */
const isFileSystemLoad = (loadPath: string) =>
  fs.statSync(loadPath).isDirectory();

/**
 * Check if the element needs to be loaded with the JsonLoader
 * @param loadPath
 */
const isJsonLoad = (loadPath: string) => isJsonFile(loadPath);

type GetLoadTypeOptions = {
  filesAndFolders?: FilesAndFoldersMap;
  erroredPaths?: ArchifiltreError[];
};

/**
 * Return the load type required to load the element located at loadPath
 * @param loadPath
 */
export const getLoader = (
  loadPath: string,
  { filesAndFolders, erroredPaths }: GetLoadTypeOptions = {}
): FileLoaderCreator => {
  if (isFileSystemLoad(loadPath)) {
    if (filesAndFolders && erroredPaths) {
      const paths = (erroredPaths || []).map(({ filePath }) => filePath);
      return makeFileSystemLoader(
        retryLoadFromFileSystem({ filesAndFolders, erroredPaths: paths })
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
 * @param reportResult
 * @param reportError
 */
export const makeFileLoadingHooksCreator = ({
  reportResult,
  reportError,
}: FileSystemReporters) => (
  step: FileSystemLoadingStep
): FileSystemLoadingHooks => {
  const resultReporter = (count?: number) => {
    if (count) {
      reportResult({
        status: step,
        count: count,
      });
    }
  };

  const { hook: onResult, getCount: getResultCount } = hookCounter(
    resultReporter
  );

  const onStart = () => resultReporter(0);
  const onComplete = () => resultReporter(getResultCount());
  const onError = (error: any) =>
    reportError({
      status: step,
      error,
    });

  return {
    onStart,
    onResult,
    onComplete,
    onError,
  };
};
