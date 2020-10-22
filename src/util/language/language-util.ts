import {
  getInitialUserSettings,
  initUserSettings,
} from "persistence/persistent-settings";
import translations from "translations/translations";

export const setupLanguage = () => {
  initUserSettings();
  translations.changeLanguage(getInitialUserSettings().language);
};
