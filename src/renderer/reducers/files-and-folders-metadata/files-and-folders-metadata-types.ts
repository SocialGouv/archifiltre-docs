export const INIT_FILES_AND_FOLDERS_METADATA =
  "FILES_AND_FOLDERS_METADATA/INIT";

export interface FilesAndFoldersMetadata {
  averageLastModified: number;
  /** in bytes */
  childrenTotalSize: number;
  initialMaxLastModified: number;
  initialMedianLastModified: number;
  initialMinLastModified: number;
  maxLastModified: number;
  medianLastModified: number;
  minLastModified: number;
  nbChildrenFiles: number;
  sortAlphaNumericallyIndex: number[];
  sortByDateIndex: number[];
  sortBySizeIndex: number[];
}

export type FilesAndFoldersMetadataMap = Record<
  string,
  FilesAndFoldersMetadata
>;

export interface FilesAndFoldersMetadataState {
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
}

interface InitFilesAndFoldersMetadataAction {
  metadata: FilesAndFoldersMetadataMap;
  type: typeof INIT_FILES_AND_FOLDERS_METADATA;
}

export type FilesAndFoldersMetadataAction = InitFilesAndFoldersMetadataAction;
