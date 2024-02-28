import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";

/**
 * Calculates and returns the number of files present in a FilesAndFoldersMap object.
 * A file is defined as having an empty 'children' array.
 *
 * @param {FilesAndFoldersMap} filesAndFoldersMap - A map object where the key is a string
 * and the value is a FilesAndFolders object. This map represents a file and folder structure.
 *
 * @returns {number} The number of files (items with an empty 'children' array) present in the filesAndFoldersMap.
 */
export const getFilesCount = (filesAndFoldersMap: FilesAndFoldersMap): number =>
  Object.values(filesAndFoldersMap).filter(
    ({ children }) => children.length === 0
  ).length;
