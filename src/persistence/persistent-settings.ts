import { app } from "@electron/remote";
import fs from "fs";
import { reportError } from "logging/reporter";
import path from "path";
import _ from "lodash";
import { getLanguage } from "languages";

export type UserSettings = {
  isTrackingEnabled: boolean;
  isMonitoringEnabled: boolean;
  language: string;
};

const defaultUserSettings: UserSettings = {
  isTrackingEnabled: true,
  isMonitoringEnabled: true,
  language: getLanguage()[0] || "en",
};

let initialUserSettings: UserSettings | undefined;

/**
 * Initialize user settings to values in user-settings.json
 */
export const initUserSettings = () => {
  if (!initialUserSettings && MODE !== "test") {
    const userSettingsFilePath = getUserSettingsFilePath();
    initialUserSettings = readUserSettings(userSettingsFilePath);
  }
};

/**
 * Getter for initial user settings
 */
export const getInitialUserSettings = () =>
  initialUserSettings || defaultUserSettings;

const getUserSettingsFilePath = () => {
  const userFolderPath = app.getPath("userData");
  return path.join(userFolderPath, "user-settings.json");
};

/**
 * Returns a normalized value of user settings
 * @param storedUserSettings - User settings stored in user-settings.json
 */
export const sanitizeUserSettings = (storedUserSettings: any): UserSettings => {
  if (!storedUserSettings) {
    return defaultUserSettings;
  }
  return _.pick(
    {
      ...defaultUserSettings,
      ...storedUserSettings,
    },
    Object.keys(defaultUserSettings)
  ) as UserSettings;
};

const readUserSettings = (userSettingsFilePath): UserSettings => {
  try {
    const storedUserSettings = fs.readFileSync(userSettingsFilePath, "utf8");
    return sanitizeUserSettings(JSON.parse(storedUserSettings));
  } catch {
    return defaultUserSettings;
  }
};

/**
 * Save new user settings in user-settings.json
 * @param newUserSettings - new value for user settings
 */
export const saveUserSettings = async (newUserSettings: UserSettings) => {
  const settingsAsString = JSON.stringify(newUserSettings);
  try {
    await fs.promises.writeFile(getUserSettingsFilePath(), settingsAsString);
  } catch (err) {
    reportError(err);
  }
};
