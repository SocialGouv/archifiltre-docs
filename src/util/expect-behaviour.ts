import { reportWarning } from "../logging/reporter";

/**
 * Expects a value to be defined. Otherwise, reports a message with the values.
 * This is a debug tool to help qualify data inconsistencies and should only be used as such.
 * @param actual
 * @param message
 */
export const expectToBeDefined = <T>(actual: T, message: string): boolean => {
  const isDefined = actual !== undefined && actual !== null;

  if (!isDefined) {
    reportWarning(
      JSON.stringify({
        actual,
        message,
        type: "expectToBeDefined"
      })
    );
  }

  return isDefined;
};
