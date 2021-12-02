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

    ".eml": FileType.EMAIL,

    
    // formats Microsoft Word
".docx": FileType.DOCUMENT,

    
// les PDF
".epub": FileType.PUBLICATION,

    ".mobi": FileType.PUBLICATION,

    
    ".dot": FileType.DOCUMENT,

    // formats d'email et d'archive email
".msg": FileType.EMAIL,

    ".dotm": FileType.DOCUMENT,

    
    ".odp": FileType.PRESENTATION,

    
".dotx": FileType.DOCUMENT,

    // formats OOo/LO Impress
".otp": FileType.PRESENTATION,

    ".jp2": FileType.IMAGE,

    ".pdf": FileType.PUBLICATION,

    ".gif": FileType.IMAGE,

    ".pot": FileType.PRESENTATION,

    ".bmp": FileType.IMAGE,

    ".pps": FileType.PRESENTATION,

    ".jpeg": FileType.IMAGE,

    ".ppsx": FileType.PRESENTATION,

    ".avi": FileType.VIDEO,

    ".ppt": FileType.PRESENTATION,

    // formats d'image
".jpg": FileType.IMAGE,

    
    ".pptm": FileType.PRESENTATION,

    
    ".mp4": FileType.VIDEO,

    // formats Microsoft PowerPoint
".pptx": FileType.PRESENTATION,

    ".mkv": FileType.VIDEO,

    ".xls": FileType.SPREADSHEET,

    ".mov": FileType.VIDEO,

    ".xlsm": FileType.SPREADSHEET,

    ".mp3": FileType.AUDIO,

    
".flac": FileType.AUDIO,

    // formats Microsoft Excel
".xlsx": FileType.SPREADSHEET,

    ".mpeg": FileType.VIDEO,

    
".arc": FileType.OTHER,

    // dont les vieux
".xlt": FileType.SPREADSHEET,

    // format Csv
".ods": FileType.SPREADSHEET,

    
".xltm": FileType.SPREADSHEET,

    ".xlw": FileType.SPREADSHEET,

    ".odt": FileType.DOCUMENT,

    ".ogg": FileType.AUDIO,

    ".xltx": FileType.SPREADSHEET,

    // formats OOo/LO Calc
    ".ots": FileType.SPREADSHEET,

    // formats OOo/LO Writer
    ".ott": FileType.DOCUMENT,

    ".png": FileType.IMAGE,

    ".pst": FileType.EMAIL,

    ".rf64": FileType.AUDIO,

    // formats texte standard
    ".rtf": FileType.DOCUMENT,

    ".svg": FileType.IMAGE,

    // archive : type autre en attendant
    ".tar": FileType.OTHER,

    ".tgz": FileType.OTHER,

    ".tif": FileType.IMAGE,

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
