export enum Language {
  FR = "fr",
  EN = "en",
  DE = "de",
}

export type WithLanguage<T> = T & { language: Language };
