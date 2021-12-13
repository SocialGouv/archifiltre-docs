import { default as translations } from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./de.json";
import en from "./en.json";
import fr from "./fr.json";

void translations.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  lng: "en",

  resources: {
    de,
    en,
    fr,
  },
});

export { translations };
