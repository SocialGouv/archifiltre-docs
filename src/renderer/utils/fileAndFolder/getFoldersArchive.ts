import {
  type FilesAndFolders,
  type FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { isFolder } from "./isFolder";

/**
 * Retrieves all folders from a FilesAndFoldersMap. A folder is defined either by having a non-empty 'children' array or by being of a type that corresponds to 'ARCHIVE'.
 *
 * This function assumes that an 'isFolder' utility function exists, which should check if a given FilesAndFolders object represents a folder according to the aforementioned criteria.
 *
 * @param {FilesAndFoldersMap} filesAndFoldersMap - The map to iterate over.
 * @returns {FilesAndFolders[]} An array of FilesAndFolders objects that are folders.
 */
export const getFoldersArchive = (filesAndFoldersMap: FilesAndFoldersMap): FilesAndFolders[] =>
  Object.values(filesAndFoldersMap).filter(isFolder);
