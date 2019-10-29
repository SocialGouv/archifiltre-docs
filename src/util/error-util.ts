import { notifyError } from "./notifications-util";

interface ErrorMessageMap {
  [errorCode: string]: string;
  default: string;
}

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
