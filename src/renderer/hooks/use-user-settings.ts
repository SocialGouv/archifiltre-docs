import { useState } from "react";

import type { UserLocalSettings } from "../persistence/persistent-settings";
import {
  getInitialUserLocalSettings,
  saveUserLocalSettings,
} from "../persistence/persistent-settings";
import { translations } from "../translations/translations";

interface UserSettingsProps {
  updateUserSettings: (
    userSettings: Partial<UserLocalSettings>
  ) => Promise<void>;
  userSettings: UserLocalSettings;
}

export const useGetUserSettings = (): UserSettingsProps => {
  const [userSettings, setUserSettings] = useState<UserLocalSettings>(
    getInitialUserLocalSettings()
  );

  const updateUserSettings = async (
    _newUserSettings: Partial<UserLocalSettings>
  ) => {
    const newUserSettings = {
      ...userSettings,
      ..._newUserSettings,
    };
    await saveUserLocalSettings(newUserSettings);
    await translations.changeLanguage(newUserSettings.language);
    setUserSettings(newUserSettings);
  };

  return { updateUserSettings, userSettings };
};
