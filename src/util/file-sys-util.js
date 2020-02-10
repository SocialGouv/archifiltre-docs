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
export const convertToPosixAbsolutePath = path => {
  const array = path.split(Path.sep);
  if (array[0] !== "") {
    array.unshift("");
  }

  return array.join("/");
};

export function isJsonFile(path) {
  const stats = Fs.statSync(path);
  return stats.isFile() && Path.extname(path) === ".json";
}

export const readFileSync = Fs.readFileSync;

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
