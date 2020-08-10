import memoize from "fast-memoize";
import _ from "lodash";
import fp from "lodash/fp";
import { medianOnSortedArray } from "util/array/array-util";
import { Mapper, not, size } from "util/functionnal-programming-utils";
import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import { StoreState } from "../store";
import {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
  FilesAndFoldersMap,
  VirtualPathToIdMap,
} from "./files-and-folders-types";
import { getHashesFromStore } from "../hashes/hashes-selectors";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";

export const ROOT_FF_ID = "";

export type FilesAndFoldersCollection = FilesAndFolders[] | FilesAndFoldersMap;

/**
 * Gets the files and folder map from the redux state
 * @param store - The current redux state
 */
export const getFilesAndFoldersFromStore = (
  store: StoreState
): FilesAndFoldersMap => getCurrentState(store.filesAndFolders).filesAndFolders;

/**
 * Get the list of files marked as ToDelete from the store
 * @param store
 */
export const getElementsToDeleteFromStore = (store: StoreState): string[] =>
  getCurrentState(store.filesAndFolders).elementsToDelete;

/**
 * Get the number of children files in a list
 */
export const getFilesTotalCount = (
  elementsIds: string[],
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
) => {
  return elementsIds.reduce(
    (count, elementId) =>
      count + filesAndFoldersMetadata[elementId]?.nbChildrenFiles,
    0
  );
};

/**
 * Get the size of children files in a list
 */
export const getFilesTotalSize = (
  elementsIds: string[],
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
) => {
  const filteredElementsIds = excludeChildNodes(
    elementsIds,
    filesAndFoldersMap
  );
  return filteredElementsIds.reduce(
    (count, elementId) =>
      count + filesAndFoldersMetadata[elementId]?.childrenTotalSize,
    0
  );
};

/**
 * Recursive function to remove all the child nodes of "elementId"
 * @param elementIds
 * @param filesAndFoldersMap
 * @param elementId
 */
const excludeChildrenNodesRec = (
  elementIds: string[],
  filesAndFoldersMap: FilesAndFoldersMap,
  elementId
) => {
  const nextElementIds = elementIds.includes(elementId)
    ? elementIds.filter((currentElement) => currentElement !== elementId)
    : elementIds;
  const { children } = filesAndFoldersMap[elementId];

  return children.reduce(
    (nextElementIds, childId) =>
      excludeChildrenNodesRec(nextElementIds, filesAndFoldersMap, childId),
    nextElementIds
  );
};

/**
 * Remove the child nodes of an existing node in the elementIds list
 * @param elementIds
 * @param filesAndFolders
 */
export const excludeChildNodes = (
  elementIds: string[],
  filesAndFolders: FilesAndFoldersMap
): string[] =>
  elementIds.reduce(
    (nextElementIds, elementId) =>
      filesAndFolders[elementId].children.reduce(
        (acc, childId) =>
          excludeChildrenNodesRec(acc, filesAndFolders, childId),
        nextElementIds
      ),
    elementIds
  );

/**
 * Gets the map from virtual path to id
 * @param store
 */
export const getVirtualPathToIdFromStore = (
  store: StoreState
): VirtualPathToIdMap => getCurrentState(store.filesAndFolders).virtualPathToId;

/**
 * Reduces a filesAndFolders tree to a single value
 * @param filesAndFoldersMap - A files and folders map
 * @param rootId - The files and folders rootId
 * @param reducer - The reducer function. Takes the children values and the file or folder and returns a reduced value.
 * @example
 *  const getFilesAndFoldersMaxLastModified = (
 *    filesAndFoldersMap: FilesAndFoldersMap,
 *    filesAndFoldersId: string
 *  ): number =>
 *    reduceFilesAndFolders(
 *      filesAndFoldersMap,
 *      filesAndFoldersId,
 *      (childrenValues, currentFilesAndFolders) =>
 *        _.max([currentFilesAndFolders.file_last_modified, ...childrenValues])
 *    );
 */
export const reduceFilesAndFolders = <ReduceResultType>(
  filesAndFoldersMap: FilesAndFoldersMap,
  rootId: string,
  reducer: (
    childrenValues: ReduceResultType[],
    currentFilesAndFolders: FilesAndFolders
  ) => ReduceResultType
) => {
  const currentFilesAndFolders = filesAndFoldersMap[rootId];
  const childrenValues = currentFilesAndFolders.children.map((childId) =>
    reduceFilesAndFolders(filesAndFoldersMap, childId, reducer)
  );

  return reducer(childrenValues, currentFilesAndFolders);
};

/**
 * Returns the maximum value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersMaxLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.max([currentFilesAndFolders.file_last_modified, ...childrenValues])
  );

/**
 * Returns the minimum value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersMinLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.min(
        [currentFilesAndFolders.file_last_modified, ...childrenValues].filter(
          (lastModifiedDate) => lastModifiedDate !== 0
        )
      )
  );

/**
 * Returns all the last_modified_date values for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
const getAllLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number[] =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) => {
      if (currentFilesAndFolders.file_last_modified === 0) {
        return _.flatten(childrenValues);
      } else {
        return [
          ..._.flatten(childrenValues),
          currentFilesAndFolders.file_last_modified,
        ];
      }
    }
  );

/**
 * Returns the average value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersAverageLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number => _.mean(getAllLastModified(filesAndFoldersMap, filesAndFoldersId));

/**
 * Returns the median value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersMedianLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  medianOnSortedArray(
    getAllLastModified(filesAndFoldersMap, filesAndFoldersId).sort(
      (value1, value2) => value1 - value2
    )
  );

/**
 * Get the total size of the selected filesAndFolders
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersTotalSize = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.sum([...childrenValues, currentFilesAndFolders.file_size])
  );

/**
 * Get the depth of the selected filesAndFolders
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersDepth = (filesAndFoldersId: string): number =>
  filesAndFoldersId.split("/").length - 2;

/**
 * Gets the comments map from the redux state
 * @param store - The current redux state
 */
export const getCommentsFromStore = (store: StoreState): CommentsMap =>
  getCurrentState(store.filesAndFolders).comments;

/**
 * Gets the aliases map from the redux state
 * @param store - The current redux state
 */
export const getAliasesFromStore = (store: StoreState): AliasMap =>
  getCurrentState(store.filesAndFolders).aliases;

/**
 * Returns true if the filesAndFolders is a file
 * @param filesAndFolders
 */
export const isFile = (filesAndFolders: FilesAndFolders): boolean =>
  filesAndFolders?.children.length === 0;

/**
 * Returns true if the filesAndFolders is a folder
 * @param filesAndFolders
 */
export const isFolder = (filesAndFolders: FilesAndFolders): boolean =>
  !isFile(filesAndFolders);

/**
 * Removes the root folder from a filesAndFolders collection
 * @param filesAndFolders
 */
const removeRootFolder: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersCollection
> = memoize(fp.filter(({ id }) => id !== ""));

/**
 * Get the files only from files and folders
 * @param filesAndFolders
 */
export const getFiles: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders[]
> = memoize(fp.filter(isFile));

/**
 * Get only files from files and folders
 */
export const getFilesMap: Mapper<
  FilesAndFoldersMap,
  FilesAndFoldersMap
> = memoize(fp.pickBy(isFile));

/**
 * Get only folders from files and folders
 */
export const getFoldersMap: Mapper<
  FilesAndFoldersMap,
  FilesAndFoldersMap
> = memoize(fp.pickBy(fp.compose([not, isFile])));

/**
 * Get folders only from files and folders
 * @param filesAndFolders
 */
export const getFolders: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders[]
> = memoize(fp.filter(fp.compose([not, isFile])));

/**
 * Returns the number of files in a FilesAndFoldersMap
 * @param filesAndFoldersMap
 */
export const getFileCount: Mapper<FilesAndFoldersMap, number> = memoize(
  fp.compose(size, getFiles, removeRootFolder)
);

/**
 * Returns the number of folders in a FilesAndFoldersMap
 * @param filesAndFoldersMap
 */
export const getFoldersCount: Mapper<FilesAndFoldersMap, number> = memoize(
  fp.compose(size, getFolders, removeRootFolder)
);

/**
 * Returns the depth of the deepest element of a filesAndFoldersMap
 * @param filesAndFoldersMap
 */
export const getMaxDepth = (filesAndFoldersMap: FilesAndFoldersMap): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    "",
    (childrenDepth: number[], currentFilesAndFolders) => {
      if (currentFilesAndFolders.children.length === 0) {
        return 0;
      }
      return Math.max(...childrenDepth) + 1;
    }
  );

/**
 * Decomposes the path to an element into each of the parent elements.
 * @param id
 */
const decomposePathToElementImpl = (id: string): string[] =>
  id.split("/").map(($, i) =>
    id
      .split("/")
      .slice(0, i + 1)
      .join("/")
  );

/**
 * Memoized function that decomposes the path to an element into each of the parent elements.
 */
export const decomposePathToElement = memoize(decomposePathToElementImpl);

export const findElementParent = (childId: string, filesAndFolders) =>
  _.find(filesAndFolders, ({ children }) => children.includes(childId));

/**
 * Retrieve an element based on its virtual path
 * @param filesAndFolders
 * @param virtualPath
 */
export const getElementByVirtualPath = (
  filesAndFolders: FilesAndFoldersMap,
  virtualPath: string
): FilesAndFolders | undefined => _.find(filesAndFolders, { virtualPath });

/**
 * Returns true when all hashes are computed, false otherwise
 * @param hashesMap
 */
export const getAreHashesReady = (store: StoreState): boolean =>
  getHashesFromStore(store)[ROOT_FF_ID] !== undefined;
