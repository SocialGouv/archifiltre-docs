import hidefile from "hidefile";
import path from "path";
import winattr from "winattr";
import { isWindows } from "../os/os-util";

/**
 * Check if a file is hidden (starts with a dot on unix or has the hidden attribute on windows)
 * The main problem with hidefile, is that it considers a file hidden on windows if it both has the
 * hidden attribute and starts with a dot. So we have to directly read the attribute using winattr.
 * @param elementPath
 */
const isHidden = (elementPath: string) =>
  isWindows()
    ? winattr.getSync(elementPath).hidden
    : hidefile.isHiddenSync(elementPath);

const IGNORED_NAMES = ["thumbs.db", ".ds_store"];
const IGNORED_EXTS = ["lnk", "tmp", "ini"];
const IGNORED_PATTERNS = [
  /^\$/, // matches files starting with $
];

/**
 * Check if a file is specifically ignored based on its filename
 * @param elementPath
 */
const isIgnored = (elementPath: string): boolean => {
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
