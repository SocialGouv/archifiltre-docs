import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/files-and-folders-loader";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { ArchifiltreThunkAction } from "../archifiltre-types";
import { initFilesAndFoldersMetatada } from "../files-and-folders-metadata/files-and-folders-metadata-actions";
import {
  addChild,
  addCommentsOnFilesAndFolders,
  removeChild,
  setFilesAndFoldersAliases,
  setFilesAndFoldersHashes,
} from "./files-and-folders-actions";
import {
  findElementParent,
  getFilesAndFoldersFromStore
} from "./files-and-folders-selectors";

interface FfHashMap {
  [fileAndFoldersId: string]: string;
}

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFoldersHashes = (
  hashes: FfHashMap
): ArchifiltreThunkAction => (dispatch) => {
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
): ArchifiltreThunkAction => (dispatch) => {
  addTracker({
    eventValue: newAlias,
    title: ActionTitle.ALIAS_ADDED,
    type: ActionType.TRACK_EVENT,
    value: `Created alias: "${newAlias}"`,
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
): ArchifiltreThunkAction => (dispatch) => {
  dispatch(addCommentsOnFilesAndFolders({ [filesAndFoldersId]: comments }));
};

export const moveElement = (elementId, newParentId): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const filesAndFolders = getFilesAndFoldersFromStore(getState());
  const parent = findElementParent(elementId, filesAndFolders);

  dispatch(removeChild(parent.id, elementId));
  dispatch(addChild(newParentId, elementId));

  const updatedFilesAndFolders = getFilesAndFoldersFromStore(getState());
  const newMetadata = createFilesAndFoldersMetadataDataStructure(
    updatedFilesAndFolders
  );

  dispatch(initFilesAndFoldersMetatada(newMetadata));
};
