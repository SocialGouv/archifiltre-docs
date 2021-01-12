export enum ArchifiltreFileSystemErrorCode {
  ENOENT = "ENOENT",
  EBUSY = "EBUSY",
  EACCES = "EACCES",
}

export enum ArchifiltreStoreThunkErrorCode {
  ROOT_PATH = "ROOT_PATH",
  INVALID_PATH = "INVALID_PATH",
}

export enum UnknownError {
  UNKNOWN = "UNKNOWN",
}

export type ArchifiltreErrorCode =
  | ArchifiltreFileSystemErrorCode
  | ArchifiltreStoreThunkErrorCode
  | UnknownError;
