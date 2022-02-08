/* eslint-disable @typescript-eslint/naming-convention */
export enum ArchifiltreDocsFileSystemErrorCode {
  ENOENT = "ENOENT",
  EBUSY = "EBUSY",
  EACCES = "EACCES",
}

export enum ArchifiltreDocsStoreThunkErrorCode {
  ROOT_PATH = "ROOT_PATH",
  INVALID_PATH = "INVALID_PATH",
}

export enum UnknownError {
  UNKNOWN = "UNKNOWN",
}

export type ArchifiltreDocsErrorCode =
  | ArchifiltreDocsFileSystemErrorCode
  | ArchifiltreDocsStoreThunkErrorCode
  | UnknownError;
