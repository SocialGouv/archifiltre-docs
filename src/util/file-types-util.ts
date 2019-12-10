import memoize from "fast-memoize";
import { invertBy } from "lodash";
import path from "path";
import { FilesAndFolders } from "../reducers/files-and-folders/files-and-folders-types";

export enum FileType {
  PUBLICATION = "publication",
  PRESENTATION = "presentation",
  SPREADSHEET = "spreadsheet",
  EMAIL = "email",
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  OTHER = "other"
}

// tslint:disable:object-literal-sort-keys
export const fileTypesByExtensions = {
  ".pdf": FileType.PUBLICATION, // les PDF
  ".epub": FileType.PUBLICATION,
  ".mobi": FileType.PUBLICATION,
  ".ppt": FileType.PRESENTATION, // formats Microsoft PowerPoint
  ".pptx": FileType.PRESENTATION,
  ".pptm": FileType.PRESENTATION,
  ".pps": FileType.PRESENTATION,
  ".ppsx": FileType.PRESENTATION,
  ".pot": FileType.PRESENTATION,
  ".odp": FileType.PRESENTATION, // formats OOo/LO Impress
  ".otp": FileType.PRESENTATION,
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
  ".eml": FileType.EMAIL, // formats d'email et d'archive email
  ".msg": FileType.EMAIL,
  ".pst": FileType.EMAIL,
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
  ".jpeg": FileType.IMAGE, // formats d'image
  ".jpg": FileType.IMAGE,
  ".jp2": FileType.IMAGE,
  ".gif": FileType.IMAGE,
  ".png": FileType.IMAGE,
  ".bmp": FileType.IMAGE,
  ".tif": FileType.IMAGE,
  ".tiff": FileType.IMAGE,
  ".svg": FileType.IMAGE,
  ".avi": FileType.VIDEO, // formats vidéo
  ".wmv": FileType.VIDEO,
  ".mp4": FileType.VIDEO,
  ".mov": FileType.VIDEO,
  ".mkv": FileType.VIDEO,
  ".mp3": FileType.AUDIO, // formats audio
  ".wav": FileType.AUDIO,
  ".rf64": FileType.AUDIO,
  ".flac": FileType.AUDIO,
  ".ogg": FileType.AUDIO,
  ".wma": FileType.AUDIO,
  ".zip": FileType.OTHER, // archive : type autre en attendant
  ".tar": FileType.OTHER,
  ".tgz": FileType.OTHER,
  ".arc": FileType.OTHER,
  ".warc": FileType.OTHER
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
