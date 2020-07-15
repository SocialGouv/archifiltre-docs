import { StoreState } from "../store";
import { FilesAndFoldersMetadataMap } from "./files-and-folders-metadata-types";
import { getCurrentState } from "reducers/enhancers/undoable/undoable-selectors";

/**
 * Gets the files and folder metadata map from the redux state
 * @param store - The current redux state
 */
export const getFilesAndFoldersMetadataFromStore = (
  store: StoreState
): FilesAndFoldersMetadataMap =>
  getCurrentState(store.filesAndFoldersMetadata).filesAndFoldersMetadata;
