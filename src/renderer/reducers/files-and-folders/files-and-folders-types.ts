import type { ArchifiltreDocsError } from "@common/utils/error";
import type { Action } from "redux";

export const INITIALIZE_FILES_AND_FOLDERS = "FILES_AND_FOLDERS/INITIALIZE";
export const REMOVE_CHILD = "FILES_AND_FOLDERS/REMOVE_CHILD";
export const ADD_CHILD = "FILES_AND_FOLDERS/ADD_CHILD";
export const SET_FILES_AND_FOLDERS_ALIAS = "FILES_AND_FOLDERS/SET_ALIAS";
export const ADD_COMMENTS_ON_FILES_AND_FOLDERS =
  "FILES_AND_FOLDERS/ADD_COMMENTS";
export const MARK_AS_TO_DELETE = "FILES_AND_FOLDERS/MARK_AS_TO_DELETE";
export const UNMARK_AS_TO_DELETE = "FILES_AND_FOLDERS/UNMARK_AS_TO_DELETE";
export const MARK_ELEMENTS_TO_DELETE =
  "FILES_AND_FOLDERS/MARK_ELEMENTS_TO_DELETE";
export const UNMARK_ELEMENTS_TO_DELETE =
  "FILES_AND_FOLDERS/UNMARK_ELEMENTS_TO_DELETE";
export const INIT_VIRTUAL_PATH_TO_ID_MAP =
  "FILES_AND_FOLDERS/INIT_VIRTUAL_PATH_TO_ID_MAP";
export const REGISTER_ERRORED_ELEMENTS =
  "FILES_AND_FOLDERS/REGISTER_ERRORED_ELEMENTS";
export const RESET_ERRORED_ELEMENTS =
  "FILES_AND_FOLDERS/RESET_ERRORED_ELEMENTS";
export const OVERRIDE_LAST_MODIFIED =
  "FILES_AND_FOLDERS/OVERRIDE_LAST_MODIFIED";
export const INIT_OVERRIDE_LAST_MODIFIED =
  "FILES_AND_FOLDERS/INIT_OVERRIDE_LAST_MODIFIED";
export const RESET_OVERRIDE_LAST_MODIFIED =
  "FILES_AND_FOLDERS/RESET_OVERRIDE_LAST_MODIFIED";

export interface FilesAndFolders {
  children: string[];
  depth?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  file_last_modified: number;
  /** in bytes */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  file_size: number;
  id: string;
  maxLastModified?: number;
  name: string;
  virtualPath: string;
}

export interface ElementWithToDelete extends FilesAndFolders {
  toDelete: boolean;
}

export type FilesAndFoldersMap = Record<string, FilesAndFolders>;

export type CommentsMap = Record<string, string>;

export type AliasMap = Record<string, string>;

export type VirtualPathToIdMap = Record<string, string>;

export type LastModifiedMap = Record<string, number>;

export interface FilesAndFoldersState {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  erroredFilesAndFolders: ArchifiltreDocsError[];
  filesAndFolders: FilesAndFoldersMap;
  overrideLastModified: LastModifiedMap;
  virtualPathToId: VirtualPathToIdMap;
}

interface InitializeFilesAndFoldersAction extends Action {
  filesAndFolders: FilesAndFoldersMap;
  type: typeof INITIALIZE_FILES_AND_FOLDERS;
}

interface RemoveChildAction extends Action {
  childId: string;
  parentId: string;
  type: typeof REMOVE_CHILD;
}

interface AddChildAction extends Action {
  childId: string;
  parentId: string;
  type: typeof ADD_CHILD;
}

interface SetFilesAndFoldersAliasAction extends Action {
  aliases: AliasMap;
  type: typeof SET_FILES_AND_FOLDERS_ALIAS;
}

interface AddCommentsOnFilesAndFoldersAction extends Action {
  comments: CommentsMap;
  type: typeof ADD_COMMENTS_ON_FILES_AND_FOLDERS;
}

interface MarkAsToDelete extends Action {
  filesAndFoldersId: string;
  type: typeof MARK_AS_TO_DELETE;
}

interface UnmarkAsToDelete extends Action {
  filesAndFoldersId: string;
  type: typeof UNMARK_AS_TO_DELETE;
}

interface MarkElementsToDelete extends Action {
  elementIds: string[];
  type: typeof MARK_ELEMENTS_TO_DELETE;
}

interface UnmarkElementsToDelete extends Action {
  elementIds: string[];
  type: typeof UNMARK_ELEMENTS_TO_DELETE;
}

interface InitVirtualPathToIdMap extends Action {
  type: typeof INIT_VIRTUAL_PATH_TO_ID_MAP;
  virtualPathToIdMap: VirtualPathToIdMap;
}

interface RegisterErroredElements extends Action {
  elements: ArchifiltreDocsError[];
  type: typeof REGISTER_ERRORED_ELEMENTS;
}

interface ResetErroredElements extends Action {
  type: typeof RESET_ERRORED_ELEMENTS;
}

interface OverrideLastModified extends Action {
  elementId: string;
  lastModified: number;
  type: typeof OVERRIDE_LAST_MODIFIED;
}

interface InitOverrideLastModified extends Action {
  overrideLastModified: LastModifiedMap;
  type: typeof INIT_OVERRIDE_LAST_MODIFIED;
}

interface ResetOverrideLastModified extends Action {
  type: typeof RESET_OVERRIDE_LAST_MODIFIED;
}

export type FilesAndFoldersActionTypes =
  | AddChildAction
  | AddCommentsOnFilesAndFoldersAction
  | InitializeFilesAndFoldersAction
  | InitOverrideLastModified
  | InitVirtualPathToIdMap
  | MarkAsToDelete
  | MarkElementsToDelete
  | OverrideLastModified
  | RegisterErroredElements
  | RemoveChildAction
  | ResetErroredElements
  | ResetOverrideLastModified
  | SetFilesAndFoldersAliasAction
  | UnmarkAsToDelete
  | UnmarkElementsToDelete;
