import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguage } from "../languages";
import fr from "./fr.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr,
  },
  lng: getLanguage()[0],
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
