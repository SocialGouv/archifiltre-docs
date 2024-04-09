import { getPath } from "@common/utils/electron";
import { type SimpleObject } from "@common/utils/object";
import fs from "fs";
import _ from "lodash";
import path from "path";

import { getLanguage } from "../languages";
import { reportError } from "../logging/reporter";
import { Language } from "../utils/language/types";

export interface UserLocalSettings {
  isMonitoringEnabled: boolean;
  isTrackingEnabled: boolean;
  language: string;
}

const defaultUserLocalSettings: UserLocalSettings = {
  isMonitoringEnabled: true,
  isTrackingEnabled: true,
  language: getLanguage()[0] || Language.EN,
};

let _initialUserLocalSettings: UserLocalSettings | undefined = undefined;
let _userSettingsFilePath: string | undefined = undefined;

function getUserLocalSettingsFilePath(): string {
  if (_userSettingsFilePath) {
    return _userSettingsFilePath;
  }

  const userFolderPath = getPath("userData");
  _userSettingsFilePath = path.join(userFolderPath, "user-settings.json");

  return _userSettingsFilePath;
}

/**
 * Initialize user settings to values in user-settings.json
 */
export function initUserLocalSettings(): void {
  if (!_initialUserLocalSettings) {
    const userSettingsFilePath = getUserLocalSettingsFilePath();
    _initialUserLocalSettings = readUserLocalSettings(userSettingsFilePath);
  }
}

/**
 * Getter for initial user settings
 */
export const getInitialUserLocalSettings = (): UserLocalSettings => {
  return _initialUserLocalSettings ?? defaultUserLocalSettings;
};

/**
 * Returns a normalized value of user settings
 * @param storedUserLocalSettings - User settings stored in user-settings.json
 */
export const sanitizeUserLocalSettings = (storedUserLocalSettings?: SimpleObject): UserLocalSettings => {
  if (!storedUserLocalSettings) {
    return defaultUserLocalSettings;
  }
  return _.pick(
    {
      ...defaultUserLocalSettings,
      ...storedUserLocalSettings,
    },
    Object.keys(defaultUserLocalSettings),
  ) as UserLocalSettings;
};

const readUserLocalSettings = (userSettingsFilePath: string): UserLocalSettings => {
  try {
    const storedUserLocalSettings = fs.readFileSync(userSettingsFilePath, "utf8");
    return sanitizeUserLocalSettings(JSON.parse(storedUserLocalSettings) as SimpleObject);
  } catch {
    return defaultUserLocalSettings;
  }
};

/**
 * Save new user settings in user-settings.json
 * @param newUserLocalSettings - new value for user settings
 */
export async function saveUserLocalSettings(newUserLocalSettings: UserLocalSettings): Promise<void> {
  const settingsAsString = JSON.stringify(newUserLocalSettings);
  try {
    const userSettingsFilePath = getUserLocalSettingsFilePath();
    await fs.promises.writeFile(userSettingsFilePath, settingsAsString);
    _initialUserLocalSettings = newUserLocalSettings;
  } catch (err: unknown) {
    reportError(err);
  }
}
