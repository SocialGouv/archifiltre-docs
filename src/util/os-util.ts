import os from "os";

const WINDOWS_OS_TYPE = "Windows_NT";

/**
 * Returns true if the program is running on windows
 */
export const isWindows = (): boolean => os.type() === WINDOWS_OS_TYPE;
