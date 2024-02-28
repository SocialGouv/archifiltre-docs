import type { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { FileType, getFileTypeFromFileName } from "../file-types";

/**
 * Checks if a given FilesAndFolders object is a folder.
 * A folder is defined either by a non-empty 'children' array or by a file type matching 'ARCHIVE'.
 *
 * @param {FilesAndFolders} filesAndFolders - The FilesAndFolders object to evaluate.
 *
 * @returns {boolean} Returns 'true' if the object is a folder, otherwise 'false'.
 */
export const isFolder = (filesAndFolders: FilesAndFolders): boolean =>
  filesAndFolders.children.length !== 0 ||
  getFileTypeFromFileName(filesAndFolders.name) === FileType.ARCHIVE;
