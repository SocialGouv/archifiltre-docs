import os from "os";

const WINDOWS_OS_TYPE = "Windows_NT";
const LINUX_OS_TYPE = "Linux";
const MAC_OS_TYPE = "Darwin";

/**
 * Returns true if the program is running on windows
 */
export const isWindows = (): boolean => os.type() === WINDOWS_OS_TYPE;

/**
 * Returns true if the program is running on macos or unix
 */
export const isUnixLike = (): boolean =>
  [LINUX_OS_TYPE, MAC_OS_TYPE].includes(os.type());
