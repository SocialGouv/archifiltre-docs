import hidefile from "hidefile";
import path from "path";

/**
 * Check if a file is hidden (starts with a dot on unix or has the hidden attribute on windows)
 * @param elementPath
 */
const isHidden = (elementPath: string) => hidefile.isHiddenSync(elementPath);

const IGNORED_NAMES = ["thumbs.db", ".ds_store"];
const IGNORED_EXTS = ["lnk", "tmp", "ini"];
const IGNORED_PATTERNS = [/^\$/];

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
