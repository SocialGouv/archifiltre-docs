import {
  type FilesAndFolders,
  type FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { isFolder } from "./isFolder";

/**
 * Retrieves all folders from a FilesAndFoldersMap.
 * Folders are defined either by a non-empty 'children' array or by a file type matching 'ARCHIVE'.
 *
 * @param {FilesAndFoldersMap} filesAndFoldersMap - The map to iterate through.
 *
 * @returns {FilesAndFolders[]} An array of FilesAndFolders objects that are folders.
 */
export const getFolders = (filesAndFoldersMap: FilesAndFoldersMap): FilesAndFolders[] =>
  Object.values(filesAndFoldersMap).filter(isFolder);
