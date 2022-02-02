import { notifyError } from "../notification/notifications-util";
import type { ArchifiltreDocsErrorCode } from "./error-codes";
import {
  ArchifiltreDocsFileSystemErrorCode,
  UnknownError,
} from "./error-codes";

/* eslint-disable @typescript-eslint/naming-convention */
export enum ArchifiltreDocsErrorType {
  STORE_THUNK = "storeThunk",
  LOADING_FILE_SYSTEM = "loadingFromFileSystem",
  COMPUTING_HASHES = "computingHashes",
  BATCH_PROCESS_ERROR = "batchProcessError",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface ArchifiltreDocsError {
  type: ArchifiltreDocsErrorType;
  filePath: string;
  reason: string;
  code: ArchifiltreDocsErrorCode;
}

export const isArchifiltreDocsError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Guard hack
  err: any | unknown
): err is ArchifiltreDocsError =>
  "type" in err && "filePath" in err && "reason" in err && "code" in err;

interface ErrorMessageMap {
  [errorCode: string]: string;
  default: string;
}

type FsErrorToArchifiltreDocsError = Record<
  string,
  ArchifiltreDocsFileSystemErrorCode
>;

const fsErrorToArchifiltreDocsError: FsErrorToArchifiltreDocsError = {
  EACCES: ArchifiltreDocsFileSystemErrorCode.EACCES,
  EBUSY: ArchifiltreDocsFileSystemErrorCode.EBUSY,
  ENOENT: ArchifiltreDocsFileSystemErrorCode.ENOENT,
};

export const convertFsErrorToArchifiltreDocsError = (
  errorCode: string
): ArchifiltreDocsFileSystemErrorCode | UnknownError =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  fsErrorToArchifiltreDocsError[errorCode] ?? UnknownError.UNKNOWN;

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

type ErrorHandler<T> = (error: ArchifiltreDocsError) => Promise<T> | T;

type ErrorHandlerConfig<T> = {
  [errorType in ArchifiltreDocsErrorCode]?: ErrorHandler<T>;
} & {
  default: ErrorHandler<T>;
};

export const makeErrorHandler =
  <T>(errorHandlerConfig: ErrorHandlerConfig<T>) =>
  async (error: ArchifiltreDocsError): Promise<T> =>
    (errorHandlerConfig[error.code] ?? errorHandlerConfig.default)(error);
