import { countItems } from "@common/utils/array";
import MD5 from "js-md5";
import { lookup } from "mime-types";

import {
  decomposePathToElement,
  isFile,
} from "../reducers/files-and-folders/files-and-folders-selectors";
import type {
  FilesAndFolders,
  FilesAndFoldersMap,
  VirtualPathToIdMap,
} from "../reducers/files-and-folders/files-and-folders-types";
import type { HashesMap } from "../reducers/hashes/hashes-types";
import { translations } from "../translations/translations";

/**
 * Returns the number of folders in an array which have strictly more that nbChildren children
 * @param nbChildren - The number of children to test
 * @param folders - The folder list
 * @returns {function(*=): *}
 */
export const countFoldersWithMoreThanNChildren =
  (nbChildren: number) =>
  (folders: FilesAndFolders[]): number =>
    countItems<FilesAndFolders>(
      (folder) => folder.children.length > nbChildren
    )(folders);

/**
 * Counts folder that are deeper than maxDepth
 * @param maxDepth - The limit depth
 * @param folders - The folder list
 * @returns {function(*=): *}
 */
export const countDeeperFolders =
  (maxDepth: number) =>
  (folders: FilesAndFolders[]): number =>
    countItems<FilesAndFolders>(
      (folder) => folder.depth ?? -Infinity > maxDepth
    )(folders);

/**
 * Counts the number of path longer than maxLength
 * @param maxLength - The limit length
 * @param paths - The list of paths
 * @returns {function(*=): *}
 */
export const countLongerPath =
  (maxLength: number) =>
  (paths: string[]): number =>
    countItems<string>((path) => path.length > maxLength)(paths);

/**
 * Sorts folders by number of childrens in a decreasing order
 */
export const sortFoldersByChildrenCount = (
  folders: FilesAndFolders[]
): FilesAndFolders[] =>
  folders.sort(
    (folder1, folder2) => folder2.children.length - folder1.children.length
  );

/**
 * Sort folders by depth in a decreasing order
 */
export const sortFoldersByDepth = (
  folders: FilesAndFolders[]
): FilesAndFolders[] =>
  folders.sort(
    (folder1, folder2) =>
      (folder2.depth ?? -Infinity) - (folder1.depth ?? -Infinity)
  );

/**
 * Returns all the folders with no child folders
 */
export const findAllFoldersWithNoSubfolder = (
  fileAndFoldersMap: FilesAndFoldersMap
): string[] => {
  const baseNodeId = "";

  const findFoldersWithNoSubfolderRec = (nodeId: string): string[] => {
    const currentNode = fileAndFoldersMap[nodeId];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!currentNode) {
      throw new Error(`${nodeId} is undefined`);
    }
    if (!currentNode.children.length) {
      return [];
    }

    const subFoldersWithNoSubfolders = currentNode.children.reduce<string[]>(
      (acc, childNodeId) =>
        acc.concat(findFoldersWithNoSubfolderRec(childNodeId)),
      []
    );

    if (!subFoldersWithNoSubfolders.length) {
      return [nodeId];
    }

    return subFoldersWithNoSubfolders;
  };

  return findFoldersWithNoSubfolderRec(baseNodeId);
};

/**
 * Transforms a fileAndFolders object to an array
 * @param filesAndFolders - An object with id (the path) as a key and the fileAndFolders data as a value
 * @returns {{Object}[]}
 */
export const filesAndFoldersMapToArray = (
  filesAndFolders: FilesAndFoldersMap
): FilesAndFolders[] =>
  Object.keys(filesAndFolders)
    .filter((id) => id)
    .map((id) => ({
      ...filesAndFolders[id],
      id,
    })) as FilesAndFolders[];

/**
 * Returns all the files from a filesAndFolders list
 * @param filesAndFoldersArray
 * @returns {*}
 */
export const getFiles = (
  filesAndFoldersArray: FilesAndFolders[]
): FilesAndFolders[] =>
  filesAndFoldersArray.filter(({ children }) => !children.length);

/**
 * Filters files and folders to only get folders
 * @param filesAndFolders
 * @returns {*}
 */
export const getFolders = (
  filesAndFolders: FilesAndFolders[]
): FilesAndFolders[] =>
  filesAndFolders.filter(({ children }) => children.length);

type HookCompute = (hashes: HashesMap) => void;

/**
 * Recursive function for computing folder hashes. This function is asynchronous to avoid blocking
 * the event loop when computing lots of hashes.
 * @param {Object} filesAndFolders - A file and folders map
 * @param {Object} hashes - A HashesMap
 * @param {String} id - The current folder ID (base is "")
 * @param {function} hook - A hook called after each computation
 * @returns {Object} - The map of all hashes for each id
 */
const recComputeFolderHash = async (
  filesAndFolders: FilesAndFoldersMap,
  hashes: HashesMap,
  id: string,
  hook: HookCompute
): Promise<HashesMap> => {
  const { children } = filesAndFolders[id];
  const hash = hashes[id];
  if (hash) {
    return { [id]: hash };
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!children?.length) {
    return { [id]: null };
  }

  const childResults = await Promise.all(
    children.map(async (childId) =>
      recComputeFolderHash(filesAndFolders, hashes, childId, hook)
    )
  );

  const childrenResults: HashesMap = Object.assign({}, ...childResults);

  const currentFolderHash = MD5(
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    children
      .map((childId) => childrenResults[childId])
      .sort()
      .join("")
  );

  const currentHashObject: HashesMap = { [id]: currentFolderHash };

  hook(currentHashObject);

  return { ...currentHashObject, ...childrenResults };
};

/**
 * Compute all the folder hashes
 * @param {Object} filesAndFolders - A filesAndFolders map
 * @param hashes - A hashes map
 * @param {function} hook - A hook called every time a hash is computed
 * @returns {Object} - A map containing all the filesAndFolders hashes
 */
export const computeFolderHashes = async (
  filesAndFolders: FilesAndFoldersMap,
  hashes: HashesMap,
  hook: HookCompute
): Promise<HashesMap> => {
  const baseFolder = "";
  return recComputeFolderHash(filesAndFolders, hashes, baseFolder, hook);
};

/**
 * Determines if suspectedParentId is an ancestor (or the same file) of baseElementId
 * @param baseElementId
 * @param suspectedAncestorId
 */
export const isExactFileOrAncestor = (
  baseElementId: string,
  suspectedAncestorId: string
): boolean => {
  const index = baseElementId.indexOf(suspectedAncestorId);
  const trailingChar = baseElementId[suspectedAncestorId.length];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !index && (trailingChar === void 0 || trailingChar === "/");
};

/**
 * Displays an element name depending on its original name and optional alias
 * @param elementName - element original name
 * @param elementAlias - element optional alias
 */
export const getDisplayName = (
  elementName: string,
  elementAlias?: string
): string => elementAlias || elementName; // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing -- Handle empty string

/**
 * Create a element id sequence from the virtual path of a file
 * @param targetElementId
 * @param filesAndFolders
 * @param virtualPathToIdMap
 */
export const createFilePathSequence = (
  targetElementId: string,
  filesAndFolders: FilesAndFoldersMap,
  virtualPathToIdMap: VirtualPathToIdMap
): string[] => {
  const { virtualPath: targetElementVirtualPath } =
    filesAndFolders[targetElementId];

  return decomposePathToElement(targetElementVirtualPath || targetElementId)
    .slice(1)
    .map((virtualPath) => virtualPathToIdMap[virtualPath] || virtualPath);
};

interface GetTypeOptions {
  folderLabel?: string;
  unknownLabel?: string;
}

/**
 * Returns the mime type of the filesAndFolders parameter. Indicates if the format is unknown or if the element is a folder
 * @param filesAndFolders
 * @param options
 * @param options.folderLabel
 * @param options.unknownLabel
 */
export const getType = (
  filesAndFolders: FilesAndFolders,
  {
    folderLabel = translations.t("common.folder"),
    unknownLabel = translations.t("common.unknown"),
  }: GetTypeOptions = {}
): string => {
  if (!isFile(filesAndFolders)) {
    return folderLabel ?? "";
  }
  const mimeType = lookup(filesAndFolders.id);
  return (mimeType ? mimeType.split("/").pop()! : unknownLabel) ?? "";
};

/**
 * Get all children of a given filesAndFolders node
 * @param filesAndFoldersMap - list of all files and folders
 * @param filesAndFoldersId - filesAndFoldersId of the node to get children from
 */
export const getAllChildren = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): string[] => {
  const allChildren: string[] = [];

  const getAllChildrenRec = (currentId: string) => {
    const { children } = filesAndFoldersMap[currentId];
    allChildren.push(currentId);
    children.forEach((childId) => {
      getAllChildrenRec(childId);
    });
  };

  getAllChildrenRec(filesAndFoldersId);
  return allChildren;
};

/**
 * Returns the name of the first level, without the initial /
 * @param filesAndFoldersMap - list of all files and folders
 */
export const getFirstLevelName = (
  filesAndFoldersMap: FilesAndFoldersMap
): string => filesAndFoldersMap[""].children[0].slice(1);

/**
 * Remove elements for which the parent is already in the array
 * @param filesAndFolders
 */
export const removeChildrenPath = (filesAndFolders: string[]): string[] =>
  filesAndFolders.reduce<string[]>(
    (acc, element) =>
      acc
        .filter(
          (includedElement) => !isExactFileOrAncestor(includedElement, element)
        )
        .concat(
          acc.some((includedElement) =>
            isExactFileOrAncestor(element, includedElement)
          )
            ? []
            : [element]
        ),
    []
  );
