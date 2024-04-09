import {
  type FilesAndFolders,
  type FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { isFile } from "./isFile";

/**
 * Retrieves all files from a FilesAndFoldersMap.
 * Files are defined as having a name and not being a folder.
 *
 * @param {FilesAndFoldersMap} filesAndFoldersMap - The map to iterate through.
 *
 * @returns {FilesAndFolders[]} An array of FilesAndFolders objects that are files.
 */
export const getFiles = (filesAndFoldersMap: FilesAndFoldersMap): FilesAndFolders[] =>
  Object.values(filesAndFoldersMap).filter(isFile);
