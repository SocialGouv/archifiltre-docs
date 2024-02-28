import type { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { FileType, getFileTypeFromFileName } from "../file-types";

/**
 * Checks if a given FilesAndFolders object is an archive folder.
 * An archive folder is defined by the file type matching 'ARCHIVE' obtained from its name.
 *
 * @param {FilesAndFolders} filesAndFolders - The FilesAndFolders object to evaluate.
 *
 * @returns {boolean} Returns 'true' if the object is an archive folder, otherwise 'false'.
 */
export const isArchiveFolder = (filesAndFolders: FilesAndFolders): boolean =>
  getFileTypeFromFileName(filesAndFolders.name) === FileType.ARCHIVE;
