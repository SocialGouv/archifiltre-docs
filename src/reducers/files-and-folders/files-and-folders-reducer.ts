import _ from "lodash";
import undoable from "../enhancers/undoable/undoable";
import {
  ADD_COMMENTS_ON_FILES_AND_FOLDERS,
  FilesAndFoldersActionTypes,
  FilesAndFoldersState,
  INITIALIZE_FILES_AND_FOLDERS,
  MARK_AS_TO_DELETE,
  SET_FILES_AND_FOLDERS_ALIAS,
  SET_FILES_AND_FOLDERS_HASHES,
  UNMARK_AS_TO_DELETE
} from "./files-and-folders-types";

export const initialState: FilesAndFoldersState = {
  elementsToDelete: [],
  filesAndFolders: {},
  hashes: {}
};

/**
 * Create a new state with the [propName] prop of the filesAndFoldersId FF
 * set to propValue
 * @param state
 * @param filesAndFoldersId
 * @param propName
 * @param propValue
 */
const setFilesAndFoldersProp = <PropType>(
  state: FilesAndFoldersState,
  filesAndFoldersId: string,
  propName: string,
  propValue: PropType
): FilesAndFoldersState => ({
  ...state,
  filesAndFolders: {
    ...state.filesAndFolders,
    [filesAndFoldersId]: {
      ...state.filesAndFolders[filesAndFoldersId],
      [propName]: propValue
    }
  }
});

/**
 * Reducer that handles files and folders data structure
 * @param state
 * @param action
 */
const filesAndFoldersReducer = (
  state = initialState,
  action: FilesAndFoldersActionTypes
): FilesAndFoldersState => {
  switch (action.type) {
    case INITIALIZE_FILES_AND_FOLDERS:
      return { ...state, filesAndFolders: action.filesAndFolders };
    case SET_FILES_AND_FOLDERS_ALIAS:
      return setFilesAndFoldersProp(
        state,
        action.filesAndFoldersId,
        "alias",
        action.alias
      );
    case SET_FILES_AND_FOLDERS_HASHES:
      return {
        ...state,
        hashes: {
          ...state.hashes,
          ...action.hashes
        }
      };
    case ADD_COMMENTS_ON_FILES_AND_FOLDERS:
      return setFilesAndFoldersProp(
        state,
        action.filesAndFoldersId,
        "comments",
        action.comments
      );
    case MARK_AS_TO_DELETE:
      return {
        ...state,
        elementsToDelete: [
          ...new Set([...state.elementsToDelete, action.filesAndFoldersId])
        ]
      };
    case UNMARK_AS_TO_DELETE:
      return {
        ...state,
        elementsToDelete: _.without(
          state.elementsToDelete,
          action.filesAndFoldersId
        )
      };
    default:
      return state;
  }
};

export { filesAndFoldersReducer };

export default undoable(filesAndFoldersReducer, initialState);
