import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./fr.json";
import en from "./en.json";
import de from "./de.json";
import {
  getInitialUserSettings,
  initUserSettings,
} from "persistence/persistent-settings";

initUserSettings();

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr,
    de,
  },
  lng: getInitialUserSettings().language,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
