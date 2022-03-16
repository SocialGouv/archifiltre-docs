import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/file-system-loading-process-utils";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { translations } from "../../translations/translations";
import { isExactFileOrAncestor } from "../../utils/file-and-folders";
import { notifyInfo } from "../../utils/notifications";
import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { commitAction } from "../enhancers/undoable/undoable-actions";
import { initFilesAndFoldersMetatada } from "../files-and-folders-metadata/files-and-folders-metadata-actions";
import {
  addChild,
  addCommentsOnFilesAndFolders,
  overrideLastModified,
  removeChild,
  setFilesAndFoldersAliases,
} from "./files-and-folders-actions";
import {
  findElementParent,
  getFilesAndFoldersFromStore,
  getLastModifiedDateOverrides,
  isFile,
} from "./files-and-folders-selectors";
import type { FilesAndFoldersMap } from "./files-and-folders-types";

/**
 * Updates the files and folders alias
 * @param filesAndFoldersId
 * @param newAlias
 */
export const updateAliasThunk =
  (filesAndFoldersId: string, newAlias: string): ArchifiltreDocsThunkAction =>
  (dispatch) => {
    addTracker({
      title: ActionTitle.ALIAS_ADDED,
      type: ActionType.TRACK_EVENT,
      value: "Alias created",
    });

    dispatch(setFilesAndFoldersAliases({ [filesAndFoldersId]: newAlias }));
    dispatch(commitAction());
  };

/**
 * Updates the filesAndFolderComment
 * @param filesAndFoldersId
 * @param comments
 */
export const updateCommentThunk =
  (filesAndFoldersId: string, comments: string): ArchifiltreDocsThunkAction =>
  (dispatch) => {
    dispatch(addCommentsOnFilesAndFolders({ [filesAndFoldersId]: comments }));
  };

export enum IsMoveValidError {
  nameConflict = "nameConflict",
  cannotMoveToChild = "cannotMoveToChild",
  cannotMoveToFile = "cannotMoveToFile",
  impossibleMove = "impossibleMove",
}

/**
 * Returns an error if the move is invalid, null otherwise
 * @param filesAndFolders - map of files and folders
 * @param newParentId - id of target element
 * @param elementId - id of moved element
 */
const isMoveValid = (
  filesAndFolders: FilesAndFoldersMap,
  newParentId: string,
  elementId: string
): IsMoveValidError | null => {
  const newParent = filesAndFolders[newParentId];
  const element = filesAndFolders[elementId];
  const newParentVirtualPath = newParent.virtualPath;
  const elementVirtualPath = element.virtualPath;
  const newSiblingsNames = newParent.children.map(
    (id) => filesAndFolders[id].name
  );
  const isNameConflict = newSiblingsNames.includes(element.name);
  if (isExactFileOrAncestor(newParentVirtualPath, elementVirtualPath)) {
    return IsMoveValidError.cannotMoveToChild;
  }
  if (isFile(newParent)) {
    return IsMoveValidError.cannotMoveToFile;
  }
  if (isNameConflict) {
    return IsMoveValidError.nameConflict;
  }

  return null;
};

/**
 * Allows to virtually move a file system element to another location
 * @param elementId
 * @param newParentId
 */
export const moveElement =
  (elementId: string, newParentId: string): ArchifiltreDocsThunkAction =>
  (dispatch, getState) => {
    const filesAndFolders = getFilesAndFoldersFromStore(getState());
    const parent = findElementParent(elementId, filesAndFolders)!;
    const error = isMoveValid(filesAndFolders, newParentId, elementId);
    if (error) {
      const errorMessage = translations.t(`workspace.${error}`);
      notifyInfo(errorMessage, translations.t("workspace.impossibleMove"));
      return;
    }

    dispatch(removeChild(parent.id, elementId));
    dispatch(addChild(newParentId, elementId));

    const updatedFilesAndFolders = getFilesAndFoldersFromStore(getState());
    const newMetadata = createFilesAndFoldersMetadataDataStructure(
      updatedFilesAndFolders
    );

    dispatch(initFilesAndFoldersMetatada(newMetadata));
    dispatch(commitAction());
  };

export const overrideLastModifiedDateThunk =
  (elementId: string, lastModified: number): ArchifiltreDocsThunkAction =>
  (dispatch, getState) => {
    dispatch(overrideLastModified(elementId, lastModified));

    const store = getState();
    const filesAndFolders = getFilesAndFoldersFromStore(store);
    const lastModifiedOverrides = getLastModifiedDateOverrides(store);
    const metadata = createFilesAndFoldersMetadataDataStructure(
      filesAndFolders,
      {},
      { lastModified: lastModifiedOverrides }
    );
    dispatch(initFilesAndFoldersMetatada(metadata));
  };
