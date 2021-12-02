import { notifyError } from "../notification/notifications-util";
import type { ArchifiltreErrorCode } from "./error-codes";
import { ArchifiltreFileSystemErrorCode, UnknownError } from "./error-codes";

/* eslint-disable @typescript-eslint/naming-convention */
export enum ArchifiltreErrorType {
    STORE_THUNK = "storeThunk",
    LOADING_FILE_SYSTEM = "loadingFromFileSystem",
    COMPUTING_HASHES = "computingHashes",
    BATCH_PROCESS_ERROR = "batchProcessError",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface ArchifiltreError {
    type: ArchifiltreErrorType;
    filePath: string;
    reason: string;
    code: ArchifiltreErrorCode;
}

interface ErrorMessageMap {
    [errorCode: string]: string;
    default: string;
}

type FsErrorToArchifiltreError = Record<string, ArchifiltreFileSystemErrorCode>;

const fsErrorToArchifiltreError: FsErrorToArchifiltreError = {
    EACCES: ArchifiltreFileSystemErrorCode.EACCES,
    EBUSY: ArchifiltreFileSystemErrorCode.EBUSY,
    ENOENT: ArchifiltreFileSystemErrorCode.ENOENT,
};

export const convertFsErrorToArchifiltreError = (
    errorCode: string
): ArchifiltreFileSystemErrorCode | UnknownError =>
    fsErrorToArchifiltreError[errorCode] ?? UnknownError.UNKNOWN;

/**
 * Reports an error based on the error code
 * @param errorCode - The error code
 * @param errorMessages - The error message map mapping all of the error codes
 * @param errorMessageTitle - The title of the error message
 */
export const handleError = (
    errorCode: string,
    errorMessages: ErrorMessageMap,
    errorMessageTitle: string
): void => {
    const message = errorMessages[errorCode] || errorMessages.default; // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing -- Handle empty string

    notifyError(message, errorMessageTitle);
};

type ErrorHandler<T> = (error: ArchifiltreError) => Promise<T> | T;

type ErrorHandlerConfig<T> = {
    [errorType in ArchifiltreErrorCode]?: ErrorHandler<T>;
} & {
    default: ErrorHandler<T>;
};

export const makeErrorHandler =
    <T>(errorHandlerConfig: ErrorHandlerConfig<T>) =>
    async (error: ArchifiltreError): Promise<T> =>
        (errorHandlerConfig[error.code] ?? errorHandlerConfig.default)(error);
