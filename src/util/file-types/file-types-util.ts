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
    // les PDF
    ".epub": FileType.PUBLICATION,
    ".mobi": FileType.PUBLICATION,
    ".odp": FileType.PRESENTATION,
    ".pdf": FileType.PUBLICATION,
    // formats OOo/LO Impress
".otp": FileType.PRESENTATION,

    
".pot": FileType.PRESENTATION,

    ".pps": FileType.PRESENTATION,

    ".ppsx": FileType.PRESENTATION,

    ".ppt": FileType.PRESENTATION,

    ".pptm": FileType.PRESENTATION,
    
    ".csv": FileType.SPREADSHEET,
    // formats Microsoft PowerPoint
".pptx": FileType.PRESENTATION,
    ".eml": FileType.EMAIL,

    ".xls": FileType.SPREADSHEET,

    ".xlsm": FileType.SPREADSHEET,
    
    // formats d'email et d'archive email
".msg": FileType.EMAIL,

    
    // formats Microsoft Excel
".xlsx": FileType.SPREADSHEET,

    
    ".doc": FileType.DOCUMENT,

    // dont les vieux
".xlt": FileType.SPREADSHEET,

    ".docm": FileType.DOCUMENT,

    ".xltm": FileType.SPREADSHEET,

    // formats Microsoft Word
".docx": FileType.DOCUMENT,

    
".xlw": FileType.SPREADSHEET,

    ".xltx": FileType.SPREADSHEET,

    ".dot": FileType.DOCUMENT,

    ".dotm": FileType.DOCUMENT,

    // format Csv
    ".ods": FileType.SPREADSHEET,

    ".dotx": FileType.DOCUMENT,
    
".jp2": FileType.IMAGE,
    // formats OOo/LO Calc
".ots": FileType.SPREADSHEET,
    ".gif": FileType.IMAGE,
    ".bmp": FileType.IMAGE,

    ".pst": FileType.EMAIL,

    ".jpeg": FileType.IMAGE,

    ".avi": FileType.VIDEO,

    
    ".odt": FileType.DOCUMENT,

    
// formats d'image
".jpg": FileType.IMAGE,

    
// formats OOo/LO Writer
".ott": FileType.DOCUMENT,

    ".txt": FileType.DOCUMENT,

    ".mp4": FileType.VIDEO,
    
".mkv": FileType.VIDEO,
    // formats texte standard
".rtf": FileType.DOCUMENT,
    ".mov": FileType.VIDEO,
    ".mp3": FileType.AUDIO,
    ".png": FileType.IMAGE,

    ".flac": FileType.AUDIO,

    ".svg": FileType.IMAGE,

    ".mpeg": FileType.VIDEO,

    ".tif": FileType.IMAGE,

    ".ogg": FileType.AUDIO,

    ".tiff": FileType.IMAGE,

    ".arc": FileType.OTHER,

    
".rf64": FileType.AUDIO,

    // formats vidéo
".wmv": FileType.VIDEO,

    // archive : type autre en attendant
    ".tar": FileType.OTHER,

    ".tgz": FileType.OTHER,

    ".warc": FileType.OTHER,
    // formats audio
    ".wav": FileType.AUDIO,
    ".wma": FileType.AUDIO,
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
