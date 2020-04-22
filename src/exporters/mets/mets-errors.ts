import translations from "translations/translations";

export const METS_EXPORT_ERROR_TITLE = translations.t(
  "export.metsExportErrorTitle"
);

/**
 * Generates the error message when a file cannot be found.
 * @param filePath
 */
export const metsExportErrorFileDoesNotExist = (filePath: string): string =>
  translations.t("export.metsExportErrorFileDoesNotExist", { filePath });

/**
 * Generates the error message when a file cannot be accessed.
 * @param filePath
 */
export const metsExportErrorCannotAccessFile = (filePath: string): string =>
  translations.t("export.metsExportErrorCannotAccessFile", { filePath });

export const METS_EXPORT_UNHANDLED_ERROR = translations.t(
  "export.metsExportUnhandledError"
);
