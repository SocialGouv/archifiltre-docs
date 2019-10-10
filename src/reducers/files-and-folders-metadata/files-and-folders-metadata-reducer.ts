import {
  FilesAndFoldersMetadataAction,
  FilesAndFoldersMetadataState,
  INIT_FILES_AND_FOLDERS_METADATA
} from "./files-and-folders-metadata-types";

const initialState: FilesAndFoldersMetadataState = {
  filesAndFoldersMetadata: {}
};

/**
 * Reducer that handles files and folders metadata structure
 * @param state
 * @param action
 */
const filesAndFoldersMetadataReducer = (
  state = initialState,
  action: FilesAndFoldersMetadataAction
): FilesAndFoldersMetadataState => {
  switch (action.type) {
    case INIT_FILES_AND_FOLDERS_METADATA:
      return {
        filesAndFoldersMetadata: action.metadata
      };
    default:
      return state;
  }
};

export default filesAndFoldersMetadataReducer;
