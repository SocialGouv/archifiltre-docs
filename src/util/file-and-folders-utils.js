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
    try {
      currentNode.children.length;
    } catch (err) {
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
