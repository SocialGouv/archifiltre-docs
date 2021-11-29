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
    type: typeof FILE_NOT_FOUND;
    path: string;
}

export interface AccessDeniedError {
    type: typeof ACCESS_DENIED;
    path: string;
}

export interface UnhandledError {
    type: typeof UNHANDLED_FILE_ERROR;
    path: string;
    reason: string;
}

export type HashComputingError =
    | AccessDeniedError
    | FileNotFoundError
    | UnhandledError;
