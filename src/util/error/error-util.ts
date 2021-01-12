import { notifyError } from "util/notification/notifications-util";
import {
  ArchifiltreErrorCode,
  ArchifiltreFileSystemErrorCode,
  UnknownError,
} from "util/error/error-codes";

export enum ArchifiltreErrorType {
  STORE_THUNK = "storeThunk",
  LOADING_FILE_SYSTEM = "loadingFromFileSystem",
  COMPUTING_HASHES = "computingHashes",
  BATCH_PROCESS_ERROR = "batchProcessError",
}

export type ArchifiltreError = {
  type: ArchifiltreErrorType;
  filePath: string;
  reason: string;
  code: ArchifiltreErrorCode;
};

type ErrorMessageMap = {
  [errorCode: string]: string;
  default: string;
};

type FsErrorToArchifiltreError = {
  [code: string]: ArchifiltreFileSystemErrorCode;
};

const fsErrorToArchifiltreError: FsErrorToArchifiltreError = {
  ENOENT: ArchifiltreFileSystemErrorCode.ENOENT,
  EBUSY: ArchifiltreFileSystemErrorCode.EBUSY,
  EACCES: ArchifiltreFileSystemErrorCode.EACCES,
};

export const convertFsErrorToArchifiltreError = (
  errorCode: string
): ArchifiltreFileSystemErrorCode | UnknownError =>
  fsErrorToArchifiltreError[errorCode] || UnknownError.UNKNOWN;

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
  const message = errorMessages[errorCode] || errorMessages.default;

  notifyError(message, errorMessageTitle);
};

type ErrorHandler<T> = (error: ArchifiltreError) => T | Promise<T>;

type ErrorHandlerConfig<T> = {
  [errorType in ArchifiltreErrorCode]?: ErrorHandler<T>;
} & {
  default: ErrorHandler<T>;
};

export const makeErrorHandler = <T>(
  errorHandlerConfig: ErrorHandlerConfig<T>
) => async (error: ArchifiltreError) =>
  (errorHandlerConfig[error.code] ?? errorHandlerConfig.default)(error);
