export const INIT_FILES_AND_FOLDERS_METADATA =
  "FILES_AND_FOLDERS_METADATA/INIT";

export interface FilesAndFoldersMetadata {
  maxLastModified: number;
  minLastModified: number;
  medianLastModified: number;
  averageLastModified: number;
  childrenTotalSize: number;
  nbChildrenFiles: number;
  sortBySizeIndex: number[];
  sortByDateIndex: number[];
  sortAlphaNumericallyIndex: number[];
}

export const filesAndFoldersMetadataKeys: (keyof FilesAndFoldersMetadata)[] = [
  "maxLastModified",
  "minLastModified",
  "medianLastModified",
  "averageLastModified",
  "childrenTotalSize",
  "nbChildrenFiles",
  "sortBySizeIndex",
  "sortByDateIndex",
  "sortAlphaNumericallyIndex",
];

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
