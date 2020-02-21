import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/files-and-folders-loader";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import translations from "../../translations/translations";
import { isExactFileOrAncestor } from "../../util/file-and-folders-utils";
import { notifyInfo } from "../../util/notifications-util";
import { ArchifiltreThunkAction } from "../archifiltre-types";
import { initFilesAndFoldersMetatada } from "../files-and-folders-metadata/files-and-folders-metadata-actions";
import {
  addChild,
  addCommentsOnFilesAndFolders,
  removeChild,
  setFilesAndFoldersAliases,
  setFilesAndFoldersHashes
} from "./files-and-folders-actions";
import {
  findElementParent,
  getFilesAndFoldersFromStore,
  isFile
} from "./files-and-folders-selectors";
import { FilesAndFoldersMap } from "./files-and-folders-types";

interface FfHashMap {
  [fileAndFoldersId: string]: string;
}

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFoldersHashes = (
  hashes: FfHashMap
): ArchifiltreThunkAction => dispatch => {
  dispatch(setFilesAndFoldersHashes(hashes));
};

/**
 * Updates the files and folders alias
 * @param filesAndFoldersId
 * @param newAlias
 */
export const updateAliasThunk = (
  filesAndFoldersId: string,
  newAlias: string
): ArchifiltreThunkAction => dispatch => {
  addTracker({
    eventValue: newAlias,
    title: ActionTitle.ALIAS_ADDED,
    type: ActionType.TRACK_EVENT,
    value: `Created alias: "${newAlias}"`
  });
  dispatch(setFilesAndFoldersAliases({ [filesAndFoldersId]: newAlias }));
};

/**
 * Updates the filesAndFolderComment
 * @param filesAndFoldersId
 * @param comments
 */
export const updateCommentThunk = (
  filesAndFoldersId,
  comments
): ArchifiltreThunkAction => dispatch => {
  dispatch(addCommentsOnFilesAndFolders({ [filesAndFoldersId]: comments }));
};

export enum IsMoveValidError {
  nameConflict = "nameConflict",
  cannotMoveElement = "cannotMoveElement"
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
  const newParentVirtualPath = filesAndFolders[newParentId].virtualPath;
  const elementVirtualPath = filesAndFolders[elementId].virtualPath;
  const newSiblingsNames = filesAndFolders[newParentId].children
    .map(id => filesAndFolders[id])
    .map(({ name }) => name);
  const isNameConflict = newSiblingsNames.includes(
    filesAndFolders[elementId].name
  );
  if (
    isExactFileOrAncestor(newParentVirtualPath, elementVirtualPath) ||
    isFile(filesAndFolders[newParentId])
  ) {
    return IsMoveValidError.cannotMoveElement;
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
export const moveElement = (elementId, newParentId): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const filesAndFolders = getFilesAndFoldersFromStore(getState());
  const parent = findElementParent(elementId, filesAndFolders);
  const error = isMoveValid(filesAndFolders, newParentId, elementId);
  if (error) {
    const errorMessage =
      error === IsMoveValidError.cannotMoveElement
        ? translations.t("workspace.cannotMoveElement")
        : translations.t("workspace.nameConflict");
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
};
