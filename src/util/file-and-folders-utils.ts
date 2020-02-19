import md5 from "js-md5";
import { lookup } from "mime-types";
import {
  decomposePathToElement,
  isFile
} from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFoldersMap,
  VirtualPathToIdMap
} from "../reducers/files-and-folders/files-and-folders-types";
import translations from "../translations/translations";
import { countItems } from "./array-util";

/**
 * Returns the number of folders in an array which have strictly more that nbChildren children
 * @param nbChildren - The number of children to test
 * @param folders - The folder list
 * @returns {function(*=): *}
 */
export const countFoldersWithMoreThanNChildren = nbChildren => folders =>
  countItems(folder => folder.children.length > nbChildren)(folders);

/**
 * Counts folder that are deeper than maxDepth
 * @param maxDepth - The limit depth
 * @param folders - The folder list
 * @returns {function(*=): *}
 */
export const countDeeperFolders = maxDepth => folders =>
  countItems(folder => folder.depth > maxDepth)(folders);

/**
 * Counts the number of path longer than maxLength
 * @param maxLength - The limit length
 * @param paths - The list of paths
 * @returns {function(*=): *}
 */
export const countLongerPath = maxLength => paths =>
  countItems(path => path.length > maxLength)(paths);

/**
 * Sorts folders by number of childrens in a decreasing order
 * @param folders
 * @returns {Array}
 */
export const sortFoldersByChildrenCount = folders =>
  folders.sort(
    (folder1, folder2) => folder2.children.length - folder1.children.length
  );

/**
 * Sort folders by depth in a decreasing order
 * @param folders
 * @returns {Array}
 */
export const sortFoldersByDepth = folders =>
  folders.sort((folder1, folder2) => folder2.depth - folder1.depth);

/**
 * Returns all the folders with no child folders
 * @param fileAndFoldersMap - A map of filesAndFolders
 * @returns {Array}
 */
export const findAllFoldersWithNoSubfolder = fileAndFoldersMap => {
  const baseNodeId = "";

  const findFoldersWithNoSubfolderRec = nodeId => {
    const currentNode = fileAndFoldersMap[nodeId];
    if (!currentNode) {
      throw new Error(`${nodeId} is undefined`);
    }
    if (currentNode.children.length === 0) {
      return [];
    }

    const subFoldersWithNoSubfolders = currentNode.children.reduce(
      (acc, childNodeId) =>
        acc.concat(findFoldersWithNoSubfolderRec(childNodeId)),
      []
    );

    if (subFoldersWithNoSubfolders.length === 0) {
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
export const filesAndFoldersMapToArray = filesAndFolders =>
  Object.keys(filesAndFolders)
    .filter(id => id !== "")
    .map(key => ({
      ...filesAndFolders[key],
      id: key
    }));

/**
 * Returns all the files from a filesAndFolders list
 * @param filesAndFoldersArray
 * @returns {*}
 */
export const getFiles = filesAndFoldersArray =>
  filesAndFoldersArray.filter(({ children }) => children.length === 0);

/**
 * Filters files and folders to only get folders
 * @param filesAndFolders
 * @returns {*}
 */
export const getFolders = filesAndFolders =>
  filesAndFolders.filter(({ children }) => children.length > 0);

/**
 * Recursive function for computing folder hashes
 * @param {Object} filesAndFolders - A file and folders map
 * @param {Object} hashes - A HashesMap
 * @param {String} id - The current folder ID (base is "")
 * @param {function} hook - A hook called after each computation
 * @returns {Object} - The map of all hashes for each id
 */
const recComputeFolderHash = (filesAndFolders, hashes, id, hook) => {
  const { children } = filesAndFolders[id];
  const hash = hashes[id];
  if (hash) {
    return { [id]: hash };
  }

  if (!children || children.length === 0) {
    return { [id]: null };
  }

  const childrenResults = children
    .map(childId =>
      recComputeFolderHash(filesAndFolders, hashes, childId, hook)
    )
    .reduce((acc, folderHashes) => ({ ...acc, ...folderHashes }));

  const currentFolderHash = md5(
    children
      .map(childId => childrenResults[childId])
      .sort()
      .join("")
  );

  const currentHashObject = { [id]: currentFolderHash };

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
export const computeFolderHashes = (filesAndFolders, hashes, hook) => {
  const baseFolder = "";
  return recComputeFolderHash(filesAndFolders, hashes, baseFolder, hook);
};

/**
 * Determines if suspectedParentId is an ancestor (or the same file) of baseElementId
 * @param baseElementId
 * @param suspectedAncestorId
 */
export const isExactFileOrAncestor = (baseElementId, suspectedAncestorId) => {
  const index = baseElementId.indexOf(suspectedAncestorId);
  const trailingChar = baseElementId[suspectedAncestorId.length];
  return index === 0 && (trailingChar === undefined || trailingChar === "/");
};

/**
 * Displays an element name depending on its original name and optional alias
 * @param elementName - element original name
 * @param elementAlias - element optional alias
 */
export const getDisplayName = (
  elementName: string,
  elementAlias: string | undefined
) =>
  elementAlias !== undefined && elementAlias !== ""
    ? elementAlias
    : elementName;

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
  const { virtualPath: targetElementVirtualPath } = filesAndFolders[
    targetElementId
  ];

  return decomposePathToElement(targetElementVirtualPath)
    .slice(1)
    .map(virtualPath => virtualPathToIdMap[virtualPath] || virtualPath);
};

/**
 * Returns the mime type of the filesAndFolders parameter. Indicates if the format is unknown or if the element is a folder
 * @param filesAndFolders
 */
export const getType = filesAndFolders => {
  if (!isFile(filesAndFolders)) {
    return translations.t("common.folder");
  }
  const mimeType = lookup(filesAndFolders.id);
  return mimeType
    ? mimeType.split("/").pop()
    : translations.t("common.unknown");
};

/**
 * Get all children of a given filesAndFolders node
 * @param filesAndFoldersMap - list of all files and folders
 * @param filesAndFoldersId - filesAndFoldersId of the node to get children from
 */
export const getAllChildren = (filesAndFoldersMap, filesAndFoldersId) => {
  const allChildren: string[] = [];

  const getAllChildrenRec = currentId => {
    const { children } = filesAndFoldersMap[currentId];
    allChildren.push(currentId);
    children.forEach(childId => getAllChildrenRec(childId));
  };

  getAllChildrenRec(filesAndFoldersId);
  return allChildren;
};
