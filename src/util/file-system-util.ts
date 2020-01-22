import { remote } from "electron";

/**
 * Prompts the user to save a file. Returns the file path if the user confirmed
 * or undefined if he canceled.
 * @param filename - Either the default name of the file or the full path to the default file
 */
export const promptUserForSave = async (
  filename: string
): Promise<string | undefined> => {
  const { filePath } = await remote.dialog.showSaveDialog({
    defaultPath: filename
  });
  return filePath;
};
