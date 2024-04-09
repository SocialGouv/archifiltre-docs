import { isWindows } from "@common/utils/os";
import path from "path";

import { getFsWin } from "./fs-win-loader";

const UNIX_HIDDEN_PREFIX = ".";

/**
 * Check is a file is hidden on a windows fileSystem. It uses the attrib command.
 * @param elementPath
 */
export const isFileHiddenOnWindows = async (elementPath: string): Promise<boolean> => {
  const fswin = await getFsWin();

  return new Promise((resolve, reject) => {
    if (!isWindows()) {
      reject(new Error("This method can only be used on a dos system"));
      return;
    }
    fswin.getAttributes(elementPath, attr => {
      resolve(attr?.IS_HIDDEN ?? false);
    });
  });
};

const isFileHiddenOnUnix = (filePath: string) => path.basename(filePath).startsWith(UNIX_HIDDEN_PREFIX);

/**
 * Check if a file is hidden (starts with a dot on unix or has the hidden attribute on windows)
 * The main problem with hidefile, is that it considers a file hidden on windows if it both has the
 * hidden attribute and starts with a dot. So we have to directly read the attributes.
 */
const isHidden = async (filePath: string) =>
  isWindows() ? isFileHiddenOnWindows(filePath) : isFileHiddenOnUnix(filePath);

const IGNORED_NAMES = ["thumbs.db", ".ds_store", ".gitkeep", "__MACOSX"];
const IGNORED_EXTS = [".lnk", ".tmp", ".ini"];
const IGNORED_PATTERNS = [
  /^\$/, // matches files starting with $
  /^~/, // matches files stating with ~
];

/**
 * Check if a file is specifically ignored based on its filename
 * @param elementPath
 */
export const isIgnored = (elementPath: string): boolean => {
  const elementName = path.basename(elementPath).toLowerCase();
  return (
    IGNORED_NAMES.includes(elementName) ||
    IGNORED_EXTS.includes(path.extname(elementPath)) ||
    IGNORED_PATTERNS.some(regex => regex.test(elementName))
  );
};

/**
 * Checks if a file should be ignored by file system loading
 */
export const shouldIgnoreElement = async (elementPath: string): Promise<boolean> => {
  if (isIgnored(elementPath)) {
    return true;
  }
  return isHidden(elementPath);
};
