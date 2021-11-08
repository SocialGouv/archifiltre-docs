export const FILE_NOT_FOUND = "FILE_NOT_FOUND";
export const ACCESS_DENIED = "ACCESS_DENIED";
export const UNHANDLED_FILE_ERROR = "UNHANDLED_FILE_ERROR";

export const fileNotFound = (path: string): FileNotFoundError => ({
    type: FILE_NOT_FOUND,
    path
});

export const accessDenied = (path: string): AccessDeniedError => ({
    type: ACCESS_DENIED,
    path
});

export const unhandledFileError = (path: string, reason: string): UnhandledError => ({
    type: UNHANDLED_FILE_ERROR,
    path,
    reason
});

export type FileNotFoundError = {
    type: typeof FILE_NOT_FOUND;
    path: string;
}

export type AccessDeniedError = {
    type: typeof ACCESS_DENIED;
    path: string;
}

export type UnhandledError = {
    type: typeof UNHANDLED_FILE_ERROR;
    path: string;
    reason: string;
}

export type HashComputingError = FileNotFoundError | AccessDeniedError | UnhandledError;
