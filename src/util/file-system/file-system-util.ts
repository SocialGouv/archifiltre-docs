import { remote, shell } from "electron";
import translations from "translations/translations";
import { notifyError } from "util/notification/notifications-util";

/**
 * Prompts the user to save a file. Returns the file path if the user confirmed
 * or undefined if he canceled.
 * @param filename - Either the default name of the file or the full path to the default file
 */
export const promptUserForSave = async (
  filename: string
): Promise<string | undefined> => {
  const { filePath } = await remote.dialog.showSaveDialog({
    defaultPath: filename,
  });
  return filePath;
};

/**
 * Open a fileSystem element with the default app (folder are opened with the file browsing app)
 * @param elementPath
 */
export const openExternalElement = async (
  elementPath: string
): Promise<void> => {
  const error = await shell.openPath(elementPath);

  if (error) {
    notifyError(
      translations.t("report.openElementErrorMessage"),
      translations.t("report.openElementErrorTitle")
    );
  }
};

export const showInFolder = async (elementPath: string) =>
  shell.showItemInFolder(elementPath);
