import path from "path";

const Fs = require("fs");
const Path = require("path");
import FileSaver from "file-saver";
import { countItems } from "./array-util";

const utf8_byte_order_mark = "\ufeff";

export const UTF8 = "utf-8";

/**
 * Open a dialog to save string data into a file
 * @param name - The default file name
 * @param content - The string content to save
 * @param format - The specific format (ex: UTF8)
 */
export function save(name, content, { format = "" } = {}) {
  let fileHead = "";

  if (format === UTF8) {
    fileHead += utf8_byte_order_mark;
  }

  const writtenData = fileHead + content;
  const blob = new Blob([writtenData], { type: "text/plain;charset=utf-8" });
  saveBlob(name, blob);
}

/**
 * Saves a blob into a file
 * @param name - The default file name
 * @param blob - The blob to save into a file
 */
export function saveBlob(name, blob) {
  FileSaver.saveAs(blob, name);
}

export const makeNameWithExt = (name, ext) => {
  return name + "_" + new Date().getTime() + "." + ext;
};

export const mkdir = path => {
  if (Fs.existsSync(path) === false) {
    mkdir(Path.dirname(path));
    Fs.mkdirSync(path);
  }
};

/**
 * Path in archifiltre should always start with '/'
 * When we drop a folder which is at the root of a file
 * system (like '/myfolder' or 'C:\myfolder' path),
 * dirname return '/' or 'C:\', so path parameter may be wrong
 * i.e. : myfolder/my/file instead of /myfolder/my/file
 *     or myfolder\my\file instead of \myfolder\my\file
 *
 * @param path
 */
const convertToPosixAbsolutePath = path => {
  const array = path.split(Path.sep);
  if (array[0] !== "") {
    array.unshift("");
  }

  return array.join("/");
};

/**
 * Recursive function for traverseFileTree
 * @param hook
 * @param path
 * @returns {([[*, *]]|[])|Array|*[][]}
 */
const recTraverseFileTree = (hook, path) => {
  try {
    const stats = Fs.statSync(path);
    if (stats.isDirectory()) {
      return Fs.readdirSync(path)
        .map(a => recTraverseFileTree(hook, Path.join(path, a)))
        .reduce((acc, val) => acc.concat(val), []);
    } else {
      hook();
      const file = {
        size: stats.size,
        lastModified: stats.mtimeMs
      };
      return [[file, path]];
    }
  } catch (e) {
    return [];
  }
};

/**
 * Calls the hook function for every file in the tree
 * @param hook - The function called for each file
 * @param folderPath - The path of the folder to traverse.
 * @returns {[string, Array]} - folderPath and array containing all the files
 */
export const traverseFileTree = (hook, folderPath) => {
  let origin = recTraverseFileTree(hook, folderPath);
  folderPath = Path.dirname(folderPath);
  origin = origin.map(([file, path]) => [
    file,
    convertToPosixAbsolutePath(path.slice(folderPath.length))
  ]);
  return [folderPath, origin];
};

export function isJsonFile(path) {
  const stats = Fs.statSync(path);
  return stats.isFile() && Path.extname(path) === ".json";
}

export const readFileSync = Fs.readFileSync;

export const recTraverseFileTreeForHook = (hook, path) => {
  try {
    const stats = Fs.statSync(path);
    if (stats.isDirectory()) {
      return Fs.readdirSync(path).map(a =>
        recTraverseFileTreeForHook(hook, Path.join(path, a))
      );
    } else {
      const name = path.split("/")[path.split("/").length - 1];
      const data = Fs.readFileSync(path);
      hook(name, data);
      return;
    }
  } catch (e) {
    return;
  }
};

/**
 * Get the number of files with .zip extension
 * @param filePaths - list of strings representing file paths
 */
export const countZipFiles = filePaths =>
  countItems(filePath => path.extname(filePath) === ".zip")(filePaths);

/**
 * Formats a path for the user file system
 * @param formattedPath
 * @returns {string}
 * @example
 * // On windows
 * console.log(formatPathForUserSystem("/folder/file"))
 * // => \folder\file
 */
export const formatPathForUserSystem = formattedPath =>
  path.normalize(formattedPath);
