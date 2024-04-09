import { type FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { isFolder } from "./isFolder";

/**
 * Checks if a given FilesAndFolders object is a file.
 * A file is defined as having a name and not being a folder.
 *
 * @param {FilesAndFolders} filesAndFolders - The FilesAndFolders object to evaluate.
 *
 * @returns {boolean} Returns 'true' if the object is a file, otherwise 'false'.
 */
export const isFile = (filesAndFolders: FilesAndFolders): boolean =>
  !!filesAndFolders.name && !isFolder(filesAndFolders);
