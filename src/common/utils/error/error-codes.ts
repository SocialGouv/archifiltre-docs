/* eslint-disable @typescript-eslint/naming-convention */
export enum ArchifiltreDocsFileSystemErrorCode {
  EACCES = "EACCES",
  EBUSY = "EBUSY",
  ENOENT = "ENOENT",
  Z_CORRUPTED = "Z_CORRUPTED",
}

export enum ArchifiltreDocsStoreThunkErrorCode {
  INVALID_PATH = "INVALID_PATH",
  ROOT_PATH = "ROOT_PATH",
}

export enum UnknownError {
  UNKNOWN = "UNKNOWN",
}

export type ArchifiltreDocsErrorCode =
  | ArchifiltreDocsFileSystemErrorCode
  | ArchifiltreDocsStoreThunkErrorCode
  | UnknownError;
