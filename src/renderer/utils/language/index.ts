import { translations } from "../../translations/translations";

export async function setupLanguage(language: string): Promise<void> {
  if (!language) {
    throw new Error("MISSING LANGUAGE");
  }

  await translations.changeLanguage(language);
}
