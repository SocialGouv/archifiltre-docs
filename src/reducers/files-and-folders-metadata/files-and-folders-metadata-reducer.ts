import {
  FilesAndFoldersMetadataAction,
  FilesAndFoldersMetadataState,
  INIT_FILES_AND_FOLDERS_METADATA,
} from "./files-and-folders-metadata-types";
import undoable from "reducers/enhancers/undoable/undoable";

export const initialState: FilesAndFoldersMetadataState = {
  filesAndFoldersMetadata: {},
};

/**
 * Reducer that handles files and folders metadata structure
 * @param state
 * @param action
 */
export const filesAndFoldersMetadataReducer = (
  state = initialState,
  action: FilesAndFoldersMetadataAction
): FilesAndFoldersMetadataState => {
  switch (action.type) {
    case INIT_FILES_AND_FOLDERS_METADATA:
      return {
        filesAndFoldersMetadata: action.metadata,
      };
    default:
      return state;
  }
};

export default undoable(filesAndFoldersMetadataReducer, initialState);
