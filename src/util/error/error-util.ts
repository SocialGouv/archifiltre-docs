import { notifyError } from "util/notification/notifications-util";

interface ErrorMessageMap {
  [errorCode: string]: string;
  default: string;
}

export enum ArchifiltreFileSystemErrorCode {
  ENOENT = "ENOENT",
  EBUSY = "EBUSY",
  EACCES = "EACCES",
}

export enum UnknownError {
  UNKNOWN = "UNKNOWN",
}

interface FsErrorToArchifiltreError {
  [code: string]: ArchifiltreFileSystemErrorCode;
}

const fsErrorToArchifiltreError: FsErrorToArchifiltreError = {
  ENOENT: ArchifiltreFileSystemErrorCode.ENOENT,
  EBUSY: ArchifiltreFileSystemErrorCode.EBUSY,
  EACCES: ArchifiltreFileSystemErrorCode.EACCES,
};

export type ArchifiltreErrorCode =
  | ArchifiltreFileSystemErrorCode
  | UnknownError;

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
