import fs from "fs";
import _ from "lodash";
import path from "path";

import { getLanguage } from "../languages";
import { reportError } from "../logging/reporter";
import { getPath } from "../util/electron/electron-util";
import type { SimpleObject } from "../util/object/object-util";

export interface UserSettings {
    isTrackingEnabled: boolean;
    isMonitoringEnabled: boolean;
    language: string;
}

const defaultUserSettings: UserSettings = {
    isMonitoringEnabled: true,
    isTrackingEnabled: true,
    language: getLanguage()[0] || "en",
};

let initialUserSettings: UserSettings | undefined = void 0;

/**
 * Initialize user settings to values in user-settings.json
 */
export const initUserSettings = (): void => {
    if (!initialUserSettings && MODE !== "test") {
        const userSettingsFilePath = getUserSettingsFilePath();
        initialUserSettings = readUserSettings(userSettingsFilePath);
    }
};

/**
 * Getter for initial user settings
 */
export const getInitialUserSettings = (): UserSettings =>
    initialUserSettings ?? defaultUserSettings;

const getUserSettingsFilePath = () => {
    const userFolderPath = getPath("userData");
    return path.join(userFolderPath, "user-settings.json");
};

/**
 * Returns a normalized value of user settings
 * @param storedUserSettings - User settings stored in user-settings.json
 */
export const sanitizeUserSettings = (
    storedUserSettings?: SimpleObject
): UserSettings => {
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

const readUserSettings = (userSettingsFilePath: string): UserSettings => {
    try {
        const storedUserSettings = fs.readFileSync(
            userSettingsFilePath,
            "utf8"
        );
        return sanitizeUserSettings(
            JSON.parse(storedUserSettings) as SimpleObject
        );
    } catch {
        return defaultUserSettings;
    }
};

/**
 * Save new user settings in user-settings.json
 * @param newUserSettings - new value for user settings
 */
export const saveUserSettings = async (
    newUserSettings: UserSettings
): Promise<void> => {
    const settingsAsString = JSON.stringify(newUserSettings);
    try {
        await fs.promises.writeFile(
            getUserSettingsFilePath(),
            settingsAsString
        );
    } catch (err: unknown) {
        reportError(err);
    }
};
