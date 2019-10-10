import { StoreState } from "../store";
import { FilesAndFoldersMetadataMap } from "./files-and-folders-metadata-types";

/**
 * Gets the files and folder metadata map from the redux state
 * @param store - The current redux state
 */
export const getFilesAndFoldersMetadataFromStore = (
  store: StoreState
): FilesAndFoldersMetadataMap =>
  store.filesAndFoldersMetadata.filesAndFoldersMetadata;
