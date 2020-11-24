import {
  ADD_CHILD,
  ADD_COMMENTS_ON_FILES_AND_FOLDERS,
  AliasMap,
  CommentsMap,
  FilesAndFoldersActionTypes,
  FilesAndFoldersMap,
  INIT_OVERRIDE_LAST_MODIFIED,
  INIT_VIRTUAL_PATH_TO_ID_MAP,
  INITIALIZE_FILES_AND_FOLDERS,
  LastModifiedMap,
  MARK_AS_TO_DELETE,
  MARK_ELEMENTS_TO_DELETE,
  OVERRIDE_LAST_MODIFIED,
  REGISTER_ERRORED_ELEMENTS,
  REMOVE_CHILD,
  RESET_ERRORED_ELEMENTS,
  RESET_OVERRIDE_LAST_MODIFIED,
  SET_FILES_AND_FOLDERS_ALIAS,
  UNMARK_AS_TO_DELETE,
  UNMARK_ELEMENTS_TO_DELETE,
  VirtualPathToIdMap,
} from "./files-and-folders-types";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";

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
 * Mark multiple elements to delete
 * @param elementIds
 */
export const unmarkElementsToDelete = (
  elementIds: string[]
): FilesAndFoldersActionTypes => ({
  elementIds,
  type: UNMARK_ELEMENTS_TO_DELETE,
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

export const initVirtualPathToIdMap = (
  virtualPathToIdMap: VirtualPathToIdMap
): FilesAndFoldersActionTypes => ({
  type: INIT_VIRTUAL_PATH_TO_ID_MAP,
  virtualPathToIdMap,
});

export const registerErroredElements = (
  elements: ArchifiltreError[]
): FilesAndFoldersActionTypes => ({
  type: REGISTER_ERRORED_ELEMENTS,
  elements,
});

export const resetErroredElements = (): FilesAndFoldersActionTypes => ({
  type: RESET_ERRORED_ELEMENTS,
});

export const overrideLastModified = (
  elementId: string,
  lastModified: number
): FilesAndFoldersActionTypes => ({
  type: OVERRIDE_LAST_MODIFIED,
  elementId,
  lastModified,
});

export const initOverrideLastModified = (
  overrideLastModified: LastModifiedMap
): FilesAndFoldersActionTypes => ({
  type: INIT_OVERRIDE_LAST_MODIFIED,
  overrideLastModified,
});

export const resetOverrideLastModified = (): FilesAndFoldersActionTypes => ({
  type: RESET_OVERRIDE_LAST_MODIFIED,
});
