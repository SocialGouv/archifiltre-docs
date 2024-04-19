import type { ArchifiltreDocsErrorCode } from "@common/utils/error/error-codes";
import {
  ArchifiltreDocsFileSystemErrorCode,
  UnknownError,
} from "@common/utils/error/error-codes";

/* eslint-disable @typescript-eslint/naming-convention */
export enum ArchifiltreDocsErrorType {
  BATCH_PROCESS_ERROR = "batchProcessError",
  COMPUTING_HASHES = "computingHashes",
  LOADING_FILE_SYSTEM = "loadingFromFileSystem",
  STORE_THUNK = "storeThunk",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface ArchifiltreDocsError {
  code: ArchifiltreDocsErrorCode;
  filePath: string;
  reason: string;
  type: ArchifiltreDocsErrorType;
}

export const isArchifiltreDocsError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Guard hack
  err: any | unknown
): err is ArchifiltreDocsError =>
  "type" in err && "filePath" in err && "reason" in err && "code" in err;

type FsErrorToArchifiltreDocsError = Record<
  string,
  ArchifiltreDocsFileSystemErrorCode
>;

const fsErrorToArchifiltreDocsError: FsErrorToArchifiltreDocsError = {
  EACCES: ArchifiltreDocsFileSystemErrorCode.EACCES,
  EBUSY: ArchifiltreDocsFileSystemErrorCode.EBUSY,
  ENOENT: ArchifiltreDocsFileSystemErrorCode.ENOENT,
  Z_CORRUPTED: ArchifiltreDocsFileSystemErrorCode.Z_CORRUPTED,
};

export const convertFsErrorToArchifiltreDocsError = (
  errorCode: string
): ArchifiltreDocsFileSystemErrorCode | UnknownError =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  fsErrorToArchifiltreDocsError[errorCode] ?? UnknownError.UNKNOWN;

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
