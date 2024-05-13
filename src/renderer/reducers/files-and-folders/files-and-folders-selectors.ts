import { medianOnSortedArray } from "@common/utils/array";
import type { ArchifiltreDocsError } from "@common/utils/error";
import type { Mapper } from "@common/utils/functionnal-programming";
import { not, size } from "@common/utils/functionnal-programming";
import _ from "lodash";
import fp from "lodash/fp";
import { useSelector } from "react-redux";

import { isCompressedFolder, isFile } from "../../utils";
import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import type { FilesAndFoldersMetadataMap } from "../files-and-folders-metadata/files-and-folders-metadata-types";
import { getHashesFromStore } from "../hashes/hashes-selectors";
import type { StoreState } from "../store";
import type {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
  FilesAndFoldersMap,
  LastModifiedMap,
  VirtualPathToIdMap,
} from "./files-and-folders-types";

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
 * Get the last modification date overrides from the store
 * @param store
 */
export const getLastModifiedDateOverrides = (
  store: StoreState
): LastModifiedMap =>
  getCurrentState(store.filesAndFolders).overrideLastModified;

export const useLastModifiedDateOverrides = (): LastModifiedMap =>
  useSelector(getLastModifiedDateOverrides);

export const getRealLastModified = (
  id: string,
  filesAndFolders: FilesAndFoldersMap,
  lastModifiedMap: LastModifiedMap
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
): number => lastModifiedMap[id] ?? filesAndFolders[id].file_last_modified;

/**
 * Get the number of children files in a list
 */
export const getFilesTotalCount = (
  elementsIds: string[],
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
): number => {
  return elementsIds.reduce(
    (count, elementId) =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
): number => {
  const filteredElementsIds = excludeChildNodes(
    elementsIds,
    filesAndFoldersMap
  );
  return filteredElementsIds.reduce(
    (count, elementId) =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  elementId: string
): string[] => {
  const nextElementIds = elementIds.includes(elementId)
    ? elementIds.filter((currentElement) => currentElement !== elementId)
    : elementIds;
  const { children } = filesAndFoldersMap[elementId];

  return children.reduce(
    (previousChildId, childId) =>
      excludeChildrenNodesRec(previousChildId, filesAndFoldersMap, childId),
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
export const reduceFilesAndFolders = <TReduceResult>(
  filesAndFoldersMap: FilesAndFoldersMap,
  rootId: string,
  reducer: (
    childrenValues: TReduceResult[],
    currentFilesAndFolders: FilesAndFolders
  ) => TReduceResult
): TReduceResult => {
  const currentFilesAndFolders = filesAndFoldersMap[rootId];
  const childrenValues = currentFilesAndFolders.children.map((childId) =>
    reduceFilesAndFolders(filesAndFoldersMap, childId, reducer)
  );

  return reducer(childrenValues, currentFilesAndFolders);
};

/**
 * Returns the maximum value of file_last_modified for this element and his subElements
 */
export const getFilesAndFoldersMaxLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.max([currentFilesAndFolders.file_last_modified, ...childrenValues]) ?? 0
  );

/**
 * Returns the minimum value of file_last_modified for this element and his subElements
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
      ) ?? 0
  );

/**
 * Returns all the last_modified_date values for this element and his subElements
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
 */
export const getFilesAndFoldersAverageLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number => _.mean(getAllLastModified(filesAndFoldersMap, filesAndFoldersId));

/**
 * Returns the median value of file_last_modified for this element and his subElements
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
 */
export const getDepthFromPath = (filesAndFoldersId: string): number =>
  filesAndFoldersId.split("/").length - 2;

/**
 * Gets the comments map from the redux state
 */
export const getCommentsFromStore = (store: StoreState): CommentsMap =>
  getCurrentState(store.filesAndFolders).comments;

/**
 * Gets the aliases map from the redux state
 */
export const getAliasesFromStore = (store: StoreState): AliasMap =>
  getCurrentState(store.filesAndFolders).aliases;

/**
 * Get only files from files and folders
 */
export const getFilesMap: Mapper<FilesAndFoldersMap, FilesAndFoldersMap> =
  fp.pickBy(isFile);

/**
 * Get only folders from files and folders
 */
export const getFoldersMap: Mapper<FilesAndFoldersMap, FilesAndFoldersMap> =
  fp.pickBy(fp.compose([not, isFile]));

/**
 * Calcule et retourne le nombre de dossiers d'archive présents dans un objet map de type FilesAndFoldersMap.
 * Un dossier d'archive est défini par un objet FilesAndFolders dont le type de fichier, déterminé par son nom, correspond à 'COMPRESSED'.
 *
 * @param {FilesAndFoldersMap} filesAndFoldersMap - Un objet map où la clé est une chaîne de caractères
 * et la valeur est un objet FilesAndFolders. Cet objet map représente une structure de fichiers et dossiers.
 *
 * @returns {number} Le nombre de dossiers d'archive (éléments dont le type de fichier correspond à 'COMPRESSED') présents dans filesAndFoldersMap.
 */
export function getCompressedFoldersCount(
  filesAndFoldersMap: FilesAndFoldersMap
): number {
  return size(Object.values(filesAndFoldersMap).filter(isCompressedFolder));
}

/**
 * Returns the depth of the deepest element of a filesAndFoldersMap
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
 * Memoized function that decomposes the path to an element into each of the parent elements.
 */
export const decomposePathToElement = (id: string): string[] =>
  id.split("/").map(($, i) =>
    id
      .split("/")
      .slice(0, i + 1)
      .join("/")
  );

export const findElementParent = (
  childId: string,
  filesAndFolders: FilesAndFoldersMap
): FilesAndFolders | undefined =>
  _.find(filesAndFolders, ({ children }) => children.includes(childId));

/**
 * Retrieve an element based on its virtual path
 */
export const getElementByVirtualPath = (
  filesAndFolders: FilesAndFoldersMap,
  virtualPath: string
): FilesAndFolders | undefined => _.find(filesAndFolders, { virtualPath });

/**
 * Returns true when all hashes are computed, false otherwise
 */
export const getAreHashesReady = (store: StoreState): boolean =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  getHashesFromStore(store)[ROOT_FF_ID] !== undefined;

/**
 * Get the registered errored files and folders
 */
export const getErroredFilesAndFolders = (
  store: StoreState
): ArchifiltreDocsError[] =>
  getCurrentState(store.filesAndFolders).erroredFilesAndFolders;

export const useFilesAndFoldersErrors = (): ArchifiltreDocsError[] =>
  useSelector(getErroredFilesAndFolders);
