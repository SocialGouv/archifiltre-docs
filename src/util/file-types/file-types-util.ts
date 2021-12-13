import { invertBy } from "lodash";
import path from "path";

import type { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";

/* eslint-disable @typescript-eslint/naming-convention */
export enum FileType {
  PUBLICATION = "publication",
  PRESENTATION = "presentation",
  SPREADSHEET = "spreadsheet",
  EMAIL = "email",
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  OTHER = "other",
}
/* eslint-enable @typescript-eslint/naming-convention */

export const fileTypesByExtensions: Record<string, FileType | undefined> = {
  ".arc": FileType.OTHER,
  ".avi": FileType.VIDEO,
  ".bmp": FileType.IMAGE,
  ".csv": FileType.SPREADSHEET,
  ".doc": FileType.DOCUMENT,
  ".docm": FileType.DOCUMENT,
  ".docx": FileType.DOCUMENT,
  ".dot": FileType.DOCUMENT,
  ".dotm": FileType.DOCUMENT,
  ".dotx": FileType.DOCUMENT,
  ".eml": FileType.EMAIL,
  ".epub": FileType.PUBLICATION,
  ".flac": FileType.AUDIO,
  ".gif": FileType.IMAGE,
  ".jp2": FileType.IMAGE,
  ".jpeg": FileType.IMAGE,
  ".jpg": FileType.IMAGE,
  ".mkv": FileType.VIDEO,
  ".mobi": FileType.PUBLICATION,
  ".mov": FileType.VIDEO,
  ".mp3": FileType.AUDIO,
  ".mp4": FileType.VIDEO,
  ".mpeg": FileType.VIDEO,
  ".msg": FileType.EMAIL,
  ".odp": FileType.PRESENTATION,
  ".ods": FileType.SPREADSHEET,
  ".odt": FileType.DOCUMENT,
  ".ogg": FileType.AUDIO,
  ".otp": FileType.PRESENTATION,
  ".ots": FileType.SPREADSHEET,
  ".ott": FileType.DOCUMENT,
  ".pdf": FileType.PUBLICATION,
  ".png": FileType.IMAGE,
  ".pot": FileType.PRESENTATION,
  ".pps": FileType.PRESENTATION,
  ".ppsx": FileType.PRESENTATION,
  ".ppt": FileType.PRESENTATION,
  ".pptm": FileType.PRESENTATION,
  ".pptx": FileType.PRESENTATION,
  ".pst": FileType.EMAIL,
  ".rf64": FileType.AUDIO,
  ".rtf": FileType.DOCUMENT,
  ".svg": FileType.IMAGE,
  ".tar": FileType.OTHER,
  ".tgz": FileType.OTHER,
  ".tif": FileType.IMAGE,
  ".tiff": FileType.IMAGE,
  ".txt": FileType.DOCUMENT,
  ".warc": FileType.OTHER,
  ".wav": FileType.AUDIO,
  ".wma": FileType.AUDIO,
  ".wmv": FileType.VIDEO,
  ".xls": FileType.SPREADSHEET,
  ".xlsm": FileType.SPREADSHEET,
  ".xlsx": FileType.SPREADSHEET,
  ".xlt": FileType.SPREADSHEET,
  ".xltm": FileType.SPREADSHEET,
  ".xltx": FileType.SPREADSHEET,
  ".xlw": FileType.SPREADSHEET,
  ".zip": FileType.OTHER,
};

type ExtensionsByFileTypes = Record<FileType, string[]>;

/**
 * Returns the file type of a file
 * @param fileAndFolders
 */
export const getFileType = (fileAndFolders: FilesAndFolders): FileType =>
  getFileTypeFromFileName(fileAndFolders.name);

/**
 * Returns the file type associated to the file name
 * @param fileName
 */
export const getFileTypeFromFileName = (fileName: string): FileType => {
  const extName = path.extname(fileName.toLowerCase());
  return fileTypesByExtensions[extName] ?? FileType.OTHER;
};

/**
 * Returns the extensions associated to each file type
 */
export const getExtensionsForEachFileType = (): ExtensionsByFileTypes =>
  invertBy(fileTypesByExtensions) as ExtensionsByFileTypes;
