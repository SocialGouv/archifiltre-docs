import { undoable } from "../enhancers/undoable/undoable";
import type {
    FilesAndFoldersMetadataAction,
    FilesAndFoldersMetadataState,
} from "./files-and-folders-metadata-types";
import { INIT_FILES_AND_FOLDERS_METADATA } from "./files-and-folders-metadata-types";

export const initialState: FilesAndFoldersMetadataState = {
    filesAndFoldersMetadata: {},
};

/**
 * Reducer that handles files and folders metadata structure
 */
export const filesAndFoldersMetadataReducer = (
    state = initialState,
    action?: FilesAndFoldersMetadataAction
): FilesAndFoldersMetadataState => {
    switch (action?.type) {
        case INIT_FILES_AND_FOLDERS_METADATA:
            return {
                filesAndFoldersMetadata: action.metadata,
            };
        default:
            return state;
    }
};

export const undoableFilesAndFoldersMetadataReducer = undoable<
    FilesAndFoldersMetadataState,
    FilesAndFoldersMetadataAction
>(filesAndFoldersMetadataReducer, initialState);
