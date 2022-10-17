/* eslint-disable @typescript-eslint/naming-convention */
export enum Language {
  DE = "de",
  EN = "en",
  FR = "fr",
}

export type WithLanguage<T = Record<string, unknown>> = T & {
  language: Language;
};
