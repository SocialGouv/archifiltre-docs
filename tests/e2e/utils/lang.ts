import { translations } from "@renderer/translations/translations";

import { escapeRegexText } from "./regexp";

const LANGUAGES = ["en", "fr", "de"];

const getTextForAllLanguages = (translationSelector: string) =>
  LANGUAGES.map((language) => getTextByLanguage(translationSelector, language));

const getTextByLanguage = (translationSelector: string, language: string) =>
  translations.t(translationSelector, { lng: language });

export const getRegexSelector = (translationSelector: string): RegExp =>
  new RegExp(
    getTextForAllLanguages(translationSelector).map(escapeRegexText).join("|")
  );

export const getTextSelector = (translationSelector: string): string =>
  `text=${getRegexSelector(translationSelector)}`;

export const findTranslatedKey = <T extends Record<string, never>>(
  object: T,
  translationKey: string
): string & (keyof T | "") =>
  Object.keys(object).find((key) =>
    getRegexSelector(translationKey).test(key)
  ) ?? "";
