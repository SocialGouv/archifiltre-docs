import type { UserSettings } from "persistence/persistent-settings";
import {
    getInitialUserSettings,
    saveUserSettings,
} from "persistence/persistent-settings";
import { useCallback, useEffect, useState } from "react";

interface UseUserSettingsResult {
    userSettings: UserSettings;
    setUserSettings: (userSettings: Partial<UserSettings>) => void;
}

export const useUserSettings = (): UseUserSettingsResult => {
    const [internalUserSettings, setInternalUserSettings] = useState(
        getInitialUserSettings()
    );

    const setUserSettings = useCallback(
        (userSettings: Partial<UserSettings>) => {
            setInternalUserSettings({
                ...internalUserSettings,
                ...userSettings,
            });
        },
        [setInternalUserSettings, internalUserSettings]
    );

    useEffect(() => {
        saveUserSettings(internalUserSettings);
    }, [internalUserSettings, setInternalUserSettings]);

    return {
        setUserSettings,
        userSettings: internalUserSettings,
    };
};
