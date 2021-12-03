import { invertBy } from "lodash";
import path from "path";
import type { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";

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

export const fileTypesByExtensions = {
    ".csv": FileType.SPREADSHEET,

    ".doc": FileType.DOCUMENT,

    ".docm": FileType.DOCUMENT,

    // formats Microsoft Word
    ".docx": FileType.DOCUMENT,

    ".dot": FileType.DOCUMENT,

    ".dotm": FileType.DOCUMENT,

    ".dotx": FileType.DOCUMENT,

    ".eml": FileType.EMAIL,

    // les PDF
    ".epub": FileType.PUBLICATION,

    ".bmp": FileType.IMAGE,

    ".gif": FileType.IMAGE,

    ".jp2": FileType.IMAGE,

    ".jpeg": FileType.IMAGE,

    ".avi": FileType.VIDEO,

    ".mobi": FileType.PUBLICATION,

    // formats d'image
    ".jpg": FileType.IMAGE,

    // formats d'email et d'archive email
    ".msg": FileType.EMAIL,

    ".mp4": FileType.VIDEO,

    ".odp": FileType.PRESENTATION,

    ".mkv": FileType.VIDEO,

    
".mov": FileType.VIDEO,

    // formats OOo/LO Impress
".otp": FileType.PRESENTATION,

    ".mp3": FileType.AUDIO,

    ".pdf": FileType.PUBLICATION,

    ".flac": FileType.AUDIO,

    ".pot": FileType.PRESENTATION,

    ".mpeg": FileType.VIDEO,

    ".pps": FileType.PRESENTATION,

    ".arc": FileType.OTHER,

    ".ppsx": FileType.PRESENTATION,

    // format Csv
".ods": FileType.SPREADSHEET,

    
".ppt": FileType.PRESENTATION,

    ".odt": FileType.DOCUMENT,

    
    ".pptm": FileType.PRESENTATION,

    
".ogg": FileType.AUDIO,

    // formats Microsoft PowerPoint
".pptx": FileType.PRESENTATION,

    // formats OOo/LO Calc
".ots": FileType.SPREADSHEET,

    
".xls": FileType.SPREADSHEET,

    // formats OOo/LO Writer
".ott": FileType.DOCUMENT,

    
    
".xlsm": FileType.SPREADSHEET,

    // formats Microsoft Excel
    ".xlsx": FileType.SPREADSHEET,

    ".png": FileType.IMAGE,

    
".pst": FileType.EMAIL,

    // dont les vieux
".xlt": FileType.SPREADSHEET,

    ".rf64": FileType.AUDIO,

    ".xltm": FileType.SPREADSHEET,

    // formats texte standard
    ".rtf": FileType.DOCUMENT,

    ".svg": FileType.IMAGE,

    // archive : type autre en attendant
".tar": FileType.OTHER,

    
    ".xlw": FileType.SPREADSHEET,

    ".tgz": FileType.OTHER,

    ".tif": FileType.IMAGE,

    ".xltx": FileType.SPREADSHEET,

    ".tiff": FileType.IMAGE,

    ".txt": FileType.DOCUMENT,

    ".warc": FileType.OTHER,

    // formats audio
    ".wav": FileType.AUDIO,

    ".wma": FileType.AUDIO,
    // formats vidéo
    ".wmv": FileType.VIDEO,
    ".zip": FileType.OTHER,
};

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
export const getExtensionsForEachFileType = () =>
    invertBy(fileTypesByExtensions);
