import memoize from "fast-memoize";
import { invertBy } from "lodash";
import path from "path";
import { FilesAndFolders } from "../reducers/files-and-folders/files-and-folders-types";

export enum FileType {
  PRESENTATION = "presentation",
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
  EMAIL = "email",
  MEDIA = "media",
  OTHER = "other"
}

// tslint:disable:object-literal-sort-keys
export const fileTypesByExtensions = {
  ".xls": FileType.SPREADSHEET, // formats Microsoft Excel
  ".xlsx": FileType.SPREADSHEET,
  ".xlsm": FileType.SPREADSHEET,
  ".xlw": FileType.SPREADSHEET, // dont les vieux
  ".xlt": FileType.SPREADSHEET,
  ".xltx": FileType.SPREADSHEET,
  ".xltm": FileType.SPREADSHEET,
  ".csv": FileType.SPREADSHEET, // format Csv
  ".ods": FileType.SPREADSHEET, // formats OOo/LO Calc
  ".ots": FileType.SPREADSHEET,
  ".doc": FileType.DOCUMENT, // formats Microsoft Word
  ".docx": FileType.DOCUMENT,
  ".docm": FileType.DOCUMENT,
  ".dot": FileType.DOCUMENT,
  ".dotx": FileType.DOCUMENT,
  ".dotm": FileType.DOCUMENT,
  ".odt": FileType.DOCUMENT, // formats OOo/LO Writer
  ".ott": FileType.DOCUMENT,
  ".txt": FileType.DOCUMENT, // formats texte standard
  ".rtf": FileType.DOCUMENT,
  ".ppt": FileType.PRESENTATION, // formats Microsoft PowerPoint
  ".pptx": FileType.PRESENTATION,
  ".pptm": FileType.PRESENTATION,
  ".pps": FileType.PRESENTATION,
  ".ppsx": FileType.PRESENTATION,
  ".pot": FileType.PRESENTATION,
  ".odp": FileType.PRESENTATION, // formats OOo/LO Impress
  ".otp": FileType.PRESENTATION,
  ".pdf": FileType.PRESENTATION, // On considère le PDF comme une présentation
  ".eml": FileType.EMAIL, // formats d'email et d'archive email
  ".msg": FileType.EMAIL,
  ".pst": FileType.EMAIL,
  ".jpeg": FileType.MEDIA, // formats d'image
  ".jpg": FileType.MEDIA,
  ".gif": FileType.MEDIA,
  ".png": FileType.MEDIA,
  ".bmp": FileType.MEDIA,
  ".tiff": FileType.MEDIA,
  ".mp3": FileType.MEDIA, // formats audio
  ".wav": FileType.MEDIA,
  ".wma": FileType.MEDIA,
  ".avi": FileType.MEDIA,
  ".wmv": FileType.MEDIA, // formats vidéo
  ".mp4": FileType.MEDIA,
  ".mov": FileType.MEDIA,
  ".mkv": FileType.MEDIA
};
// tslint:enable:object-literal-sort-keys

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
  return fileTypesByExtensions[extName] || FileType.OTHER;
};

/**
 * Returns the extensions associated to each file type
 */
export const getExtensionsForEachFileType = memoize(() =>
  invertBy(fileTypesByExtensions)
);
