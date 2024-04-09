import { type FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { isFile } from "./isFile";

/**
 * Récupère tous les fichiers d'un tableau de FilesAndFolders.
 * @param filesAndFoldersArray Le tableau de FilesAndFolders à filtrer.
 * @returns {FilesAndFolders[]} Un tableau contenant uniquement les fichiers.
 */
export const getFilesFromArray = (filesAndFoldersArray: FilesAndFolders[]): FilesAndFolders[] =>
  filesAndFoldersArray.filter(isFile);
