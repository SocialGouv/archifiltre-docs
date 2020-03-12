import fs from "fs";
import path from "path";
import FileSaver from "file-saver";
import { countItems } from "./array-util";
import dateFormat from "dateformat";

const utf8ByteOrderMark = "\ufeff";

export const UTF8 = "utf-8";

/**
 * Open a dialog to save string data into a file
 * @param name - The default file name
 * @param content - The string content to save
 * @param format - The specific format (ex: UTF8)
 */
export const save = (name, content, { format = "" } = {}) => {
  let fileHead = "";

  if (format === UTF8) {
    fileHead += utf8ByteOrderMark;
  }

  const writtenData = fileHead + content;
  const blob = new Blob([writtenData], { type: "text/plain;charset=utf-8" });
  saveBlob(name, blob);
};

/**
 * Saves a blob into a file
 * @param name - The default file name
 * @param blob - The blob to save into a file
 */
export const saveBlob = (name, blob) => {
  FileSaver.saveAs(blob, name);
};

export const getNameWithExtension = (name, extension) =>
  `${name}_${dateFormat(new Date(), "yyyy_mm_dd_HH_MM")}.${extension}`;

export const mkdir = dirPath => {
  if (!fs.existsSync(dirPath)) {
    mkdir(path.dirname(dirPath));
    fs.mkdirSync(dirPath);
  }
};

/**
 * Path in archifiltre should always start with '/'
 * When we drop a folder which is at the root of a file
 * system (like '/myfFolder' or 'C:\myFolder' path),
 * dirname return '/' or 'C:\', so path parameter may be wrong
 * i.e. : myFolder/my/file instead of /myFolder/my/file
 *     or myFolder\my\file instead of \myFolder\my\file
 *
 * @param filePath
 */
export const convertToPosixAbsolutePath = filePath => {
  const array = filePath.split(path.sep);
  if (array[0] !== "") {
    array.unshift("");
  }

  return array.join("/");
};

export const isJsonFile = filePath => {
  const stats = fs.statSync(filePath);
  return stats.isFile() && path.extname(filePath) === ".json";
};

export const readFileSync = fs.readFileSync;

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
