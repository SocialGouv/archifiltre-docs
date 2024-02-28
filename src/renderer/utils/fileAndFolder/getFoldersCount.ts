import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";

/**
 * Calculates and returns the number of folders present in a FilesAndFoldersMap object.
 * A folder is defined as having a non-empty 'children' array.
 *
 * @param {FilesAndFoldersMap} filesAndFoldersMap - A map object where the key is a string
 * and the value is a FilesAndFolders object. This map represents a file and folder structure.
 *
 * @returns {number} The number of folders (items with a non-empty 'children' array) present in the filesAndFoldersMap.
 */
export const getFoldersCount = (
  filesAndFoldersMap: FilesAndFoldersMap
): number =>
  Object.values(filesAndFoldersMap).filter(
    ({ children }) => children.length > 0
  ).length;
