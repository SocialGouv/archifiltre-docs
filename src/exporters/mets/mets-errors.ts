import pick from "../../languages";

export const METS_EXPORT_ERROR_TITLE = pick({
  en: "METS export error",
  fr: "Erreur dans l'export METS"
});

/**
 * Generates the error message when a file cannot be found.
 * @param filePath
 */
export const metsExportErrorFileDoesNotExist = (filePath: string): string =>
  pick({
    en: `File "${filePath}" cannot be found. It may have been moved or deleted.`,
    fr: `Le fichier "${filePath}" est introuvable. Il a peut-être été supprimé ou déplacé.`
  });

/**
 * Generates the error message when a file cannot be accessed.
 * @param filePath
 */
export const metsExportErrorCannotAccessFile = (filePath: string): string =>
  pick({
    en: `Cannot access file "${filePath}". You may have lost access to the file`,
    fr: `Accès au fichier "${filePath} impossible". Vous avez peut-être perdu l'accès.`
  });

export const METS_EXPORT_UNHANDLED_ERROR = pick({
  en: "An unexpected error occurred",
  fr: "Une erreur inattendue s'est produite"
});
