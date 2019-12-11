import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguage } from "../languages";

const fr = require("./fr");
const en = require("./en");

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr
  },
  lng: getLanguage()[0],
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

export default i18n;
