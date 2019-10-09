import undoable from "../enhancers/undoable/undoable";
import {
  FilesAndFoldersActionTypes,
  FilesAndFoldersState,
  INITIALIZE_FILES_AND_FOLDERS
} from "./files-and-folders-types";

const initialState: FilesAndFoldersState = {
  filesAndFolders: {}
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
      return { filesAndFolders: action.filesAndFolders };
    default:
      return state;
  }
};

export { filesAndFoldersReducer };

export default undoable(filesAndFoldersReducer, initialState);
