import {
  ADD_CHILD,
  ADD_COMMENTS_ON_FILES_AND_FOLDERS,
  AliasMap,
  CommentsMap,
  FilesAndFoldersActionTypes,
  FilesAndFoldersMap,
  INITIALIZE_FILES_AND_FOLDERS,
  MARK_AS_TO_DELETE,
  MARK_ELEMENTS_TO_DELETE,
  REMOVE_CHILD,
  SET_FILES_AND_FOLDERS_ALIAS,
  UNMARK_AS_TO_DELETE,
} from "./files-and-folders-types";

/**
 * Action to set the initial state of the files and folders store
 * @param filesAndFolders - The files and folders to set
 */
export const initializeFilesAndFolders = (
  filesAndFolders: FilesAndFoldersMap
): FilesAndFoldersActionTypes => ({
  filesAndFolders,
  type: INITIALIZE_FILES_AND_FOLDERS,
});

/**
 * Action to set an alias to a FileAndFolder
 * @param aliases
 */
export const setFilesAndFoldersAliases = (
  aliases: AliasMap
): FilesAndFoldersActionTypes => ({
  aliases,
  type: SET_FILES_AND_FOLDERS_ALIAS,
});

/**
 * Add comments on a FileAndFolder
 * @param comments
 */
export const addCommentsOnFilesAndFolders = (
  comments: CommentsMap
): FilesAndFoldersActionTypes => ({
  comments,
  type: ADD_COMMENTS_ON_FILES_AND_FOLDERS,
});

/**
 * Marks an element as to delete
 * @param filesAndFoldersId
 */
export const markAsToDelete = (
  filesAndFoldersId: string
): FilesAndFoldersActionTypes => ({
  filesAndFoldersId,
  type: MARK_AS_TO_DELETE,
});

/**
 * Mark multiple elements to delete
 * @param elementIds
 */
export const markElementsToDelete = (
  elementIds: string[]
): FilesAndFoldersActionTypes => ({
  elementIds,
  type: MARK_ELEMENTS_TO_DELETE,
});

/**
 * Unmark an element as to delete
 * @param filesAndFoldersId
 */
export const unmarkAsToDelete = (
  filesAndFoldersId: string
): FilesAndFoldersActionTypes => ({
  filesAndFoldersId,
  type: UNMARK_AS_TO_DELETE,
});

/**
 * Remove the child of a files and folders
 * @param parentId
 * @param childId
 */
export const removeChild = (parentId, childId): FilesAndFoldersActionTypes => ({
  childId,
  parentId,
  type: REMOVE_CHILD,
});

/**
 * Remove the
 * @param parentId
 * @param childId
 */
export const addChild = (parentId, childId): FilesAndFoldersActionTypes => ({
  childId,
  parentId,
  type: ADD_CHILD,
});
