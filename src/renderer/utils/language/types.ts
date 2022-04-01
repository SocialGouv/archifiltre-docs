/* eslint-disable @typescript-eslint/naming-convention */
export enum Language {
  DE = "de",
  EN = "en",
  FR = "fr",
}

export type WithLanguage<T> = T & { language: Language };
