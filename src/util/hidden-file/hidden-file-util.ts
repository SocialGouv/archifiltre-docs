import hidefile from "hidefile";
import path from "path";
import { promisify } from "util";
import { isWindows } from "../os/os-util";
import fswin from "util/fs-win-loader";

/**
 * Check is a file is hidden on a windows fileSystem. It uses the attrib command.
 * @param elementPath
 */
export const isFileHiddenOnWindows = (elementPath: string): boolean => {
  if (!isWindows()) {
    throw new Error("This method can only be used on a dos system");
  }

  return fswin.getAttributesSync(elementPath).IS_HIDDEN;
};

export const asyncIsFileHiddenOnWindows = async (
  elementPath: string
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    if (!isWindows()) {
      reject(new Error("This method can only be used on a dos system"));
      return;
    }
    fswin.getAttributes(elementPath, (attr) => {
      resolve(attr ? attr.IS_HIDDEN : false);
    });
  });

/**
 * Check if a file is hidden (starts with a dot on unix or has the hidden attribute on windows)
 * The main problem with hidefile, is that it considers a file hidden on windows if it both has the
 * hidden attribute and starts with a dot. So we have to directly read the attributes.
 * @param elementPath
 */
const isHidden = (elementPath: string): boolean =>
  isWindows()
    ? isFileHiddenOnWindows(elementPath)
    : hidefile.isHiddenSync(elementPath);

const promiseIsHidden = promisify(hidefile.isHidden);

const asyncIsHidden = async (elementPath: string): Promise<boolean> =>
  isWindows()
    ? asyncIsFileHiddenOnWindows(elementPath)
    : promiseIsHidden(elementPath);

const IGNORED_NAMES = ["thumbs.db", ".ds_store", ".gitkeep"];
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
    IGNORED_PATTERNS.some((regex) => regex.test(elementName))
  );
};

/**
 * Checks if a file should be ignored by file system loading
 * @param elementPath
 */
export const shouldIgnoreElement = (elementPath: string): boolean =>
  isHidden(elementPath) || isIgnored(elementPath);

export const asyncShouldIgnoreElement = async (
  elementPath: string
): Promise<boolean> => {
  if (await isIgnored(elementPath)) {
    return true;
  }
  return asyncIsHidden(elementPath);
};
