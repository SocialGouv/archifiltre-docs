import childProcess from "child_process";
import hidefile from "hidefile";
import path from "path";
import { isWindows } from "../os/os-util";

/**
 * Check is a file is hidden on a windows fileSystem. It uses the attrib command.
 * @param elementPath
 */
const isFileHiddenOnWindows = (elementPath: string): boolean => {
  if (!isWindows()) {
    throw new Error("This method can only be used on a dos system");
  }
  const { stdout } = childProcess.spawnSync("attrib", [elementPath]);
  const result = stdout.toString();
  const HIDDEN_ATTRIBUTE_INDEX = 4;
  // The result of the attrib command is pretty weird. It looks like that:
  // "A  SHR D:\path\to\the\file"
  // It means that the file is hidden if the character at index 4 is "H", otherwise
  // It would be an empty space.
  // For more info, check the attrib command doc writing `attrib /?` in a dos cmd
  return result[HIDDEN_ATTRIBUTE_INDEX] === "H";
};

/**
 * Check if a file is hidden (starts with a dot on unix or has the hidden attribute on windows)
 * The main problem with hidefile, is that it considers a file hidden on windows if it both has the
 * hidden attribute and starts with a dot. So we have to directly read the attributes.
 * @param elementPath
 */
const isHidden = (elementPath: string) =>
  isWindows()
    ? isFileHiddenOnWindows(elementPath)
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
