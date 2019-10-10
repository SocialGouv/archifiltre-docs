export const INIT_FILES_AND_FOLDERS_METADATA =
  "FILES_AND_FOLDERS_METADATA/INIT";

export interface FilesAndFoldersMetadata {
  maxLastModified: number;
  minLastModified: number;
  medianLastModified: number;
  averageLastModified: number;
  childrenTotalSize: number;
}

export interface FilesAndFoldersMetadataMap {
  [filesAndFoldersId: string]: FilesAndFoldersMetadata;
}

export interface FilesAndFoldersMetadataState {
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
}

interface InitFilesAndFoldersMetadataAction {
  type: typeof INIT_FILES_AND_FOLDERS_METADATA;
  metadata: FilesAndFoldersMetadataMap;
}

export type FilesAndFoldersMetadataAction = InitFilesAndFoldersMetadataAction;
