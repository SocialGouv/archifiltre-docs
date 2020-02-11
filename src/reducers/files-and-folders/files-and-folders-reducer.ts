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
  aliases: {},
  comments: {},
  elementsToDelete: [],
  filesAndFolders: {},
  hashes: {}
};

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
      return {
        ...state,
        aliases: {
          ...state.aliases,
          ...action.aliases
        }
      };
    case SET_FILES_AND_FOLDERS_HASHES:
      return {
        ...state,
        hashes: {
          ...state.hashes,
          ...action.hashes
        }
      };
    case ADD_COMMENTS_ON_FILES_AND_FOLDERS:
      return {
        ...state,
        comments: {
          ...state.comments,
          ...action.comments
        }
      };
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
