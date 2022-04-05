export const FILE_NOT_FOUND = "FILE_NOT_FOUND";
export const ACCESS_DENIED = "ACCESS_DENIED";
export const UNHANDLED_FILE_ERROR = "UNHANDLED_FILE_ERROR";

export const fileNotFound = (path: string): FileNotFoundError => ({
  path,
  type: FILE_NOT_FOUND,
});

export const accessDenied = (path: string): AccessDeniedError => ({
  path,
  type: ACCESS_DENIED,
});

export const unhandledFileError = (
  path: string,
  reason: string
): UnhandledError => ({
  path,
  reason,
  type: UNHANDLED_FILE_ERROR,
});

export interface FileNotFoundError {
  path: string;
  type: typeof FILE_NOT_FOUND;
}

export interface AccessDeniedError {
  path: string;
  type: typeof ACCESS_DENIED;
}

export interface UnhandledError {
  path: string;
  reason: string;
  type: typeof UNHANDLED_FILE_ERROR;
}

export type HashComputingError =
  | AccessDeniedError
  | FileNotFoundError
  | UnhandledError;
