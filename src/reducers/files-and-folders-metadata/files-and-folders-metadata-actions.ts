import {
  FilesAndFoldersMetadataAction,
  FilesAndFoldersMetadataMap,
  INIT_FILES_AND_FOLDERS_METADATA,
} from "./files-and-folders-metadata-types";

/**
 * Sets files and folders prcomputed metadata into the store
 * @param filesAndFoldersId
 * @param metadata
 */
export const initFilesAndFoldersMetatada = (
  metadata: FilesAndFoldersMetadataMap
): FilesAndFoldersMetadataAction => ({
  metadata,
  type: INIT_FILES_AND_FOLDERS_METADATA,
});
