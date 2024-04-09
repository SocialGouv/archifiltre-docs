export enum Language {
  DE = "de",
  EN = "en",
  FR = "fr",
}

export type WithLanguage<T = Record<string, unknown>> = T & {
  language: Language;
};
