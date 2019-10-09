import undoable from "../enhancers/undoable/undoable";
import {
  FilesAndFoldersActionTypes,
  FilesAndFoldersState,
  INITIALIZE_FILES_AND_FOLDERS,
  SET_FILES_AND_FOLDERS_ALIAS,
  SET_FILES_AND_FOLDERS_HASH
} from "./files-and-folders-types";

const initialState: FilesAndFoldersState = {
  filesAndFolders: {}
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
      return { filesAndFolders: action.filesAndFolders };
    case SET_FILES_AND_FOLDERS_ALIAS:
      return setFilesAndFoldersProp(
        state,
        action.filesAndFoldersId,
        "alias",
        action.alias
      );
    case SET_FILES_AND_FOLDERS_HASH:
      return setFilesAndFoldersProp(
        state,
        action.filesAndFoldersId,
        "hash",
        action.hash
      );
    default:
      return state;
  }
};

export { filesAndFoldersReducer };

export default undoable(filesAndFoldersReducer, initialState);
