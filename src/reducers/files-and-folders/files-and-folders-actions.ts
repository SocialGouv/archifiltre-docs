import {
  ADD_COMMENTS_ON_FILES_AND_FOLDERS,
  FilesAndFoldersActionTypes,
  FilesAndFoldersMap,
  HashesMap,
  INITIALIZE_FILES_AND_FOLDERS,
  MARK_AS_TO_DELETE,
  SET_FILES_AND_FOLDERS_ALIAS,
  SET_FILES_AND_FOLDERS_HASHES,
  UNMARK_AS_TO_DELETE
} from "./files-and-folders-types";

/**
 * Action to set the initial state of the files and folders store
 * @param filesAndFolders - The files and folders to set
 */
export const initializeFilesAndFolders = (
  filesAndFolders: FilesAndFoldersMap
): FilesAndFoldersActionTypes => ({
  filesAndFolders,
  type: INITIALIZE_FILES_AND_FOLDERS
});

/**
 * Action to set an alias to a FileAndFolder
 * @param filesAndFoldersId
 * @param alias
 */
export const setFilesAndFoldersAlias = (
  filesAndFoldersId: string,
  alias: string
): FilesAndFoldersActionTypes => ({
  alias,
  filesAndFoldersId,
  type: SET_FILES_AND_FOLDERS_ALIAS
});

/**
 * Action to set hashes to FileAndFolders
 * @param hashes
 */
export const setFilesAndFoldersHashes = (
  hashes: HashesMap
): FilesAndFoldersActionTypes => ({
  hashes,
  type: SET_FILES_AND_FOLDERS_HASHES
});

/**
 * Add comments on a FileAndFolder
 * @param filesAndFoldersId
 * @param comments
 */
export const addCommentsOnFilesAndFolders = (
  filesAndFoldersId: string,
  comments: string
): FilesAndFoldersActionTypes => ({
  comments,
  filesAndFoldersId,
  type: ADD_COMMENTS_ON_FILES_AND_FOLDERS
});

/**
 * Marks an element as to delete
 * @param filesAndFoldersId
 */
export const markAsToDelete = (
  filesAndFoldersId: string
): FilesAndFoldersActionTypes => ({
  filesAndFoldersId,
  type: MARK_AS_TO_DELETE
});

/**
 * Unmark an element as to delete
 * @param filesAndFoldersId
 */
export const unmarkAsToDelete = (
  filesAndFoldersId: string
): FilesAndFoldersActionTypes => ({
  filesAndFoldersId,
  type: UNMARK_AS_TO_DELETE
});
