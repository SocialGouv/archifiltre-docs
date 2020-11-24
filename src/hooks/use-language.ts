import { useCallback, useEffect, useState } from "react";
import translations from "translations/translations";
import { useUserSettings } from "hooks/use-user-settings";

export enum Language {
  FR = "fr",
  EN = "en",
  DE = "de",
}

/**
 * Hook that allows to get and change the application language
 */
export const useLanguage = (): [Language, (language: Language) => void] => {
  const [innerLanguage, setInnerLanguage] = useState<Language>(
    translations.language as Language
  );
  const { setUserSettings } = useUserSettings();

  useEffect(() => {
    const onLanguageChanged = (lang) => {
      setInnerLanguage(lang);
    };
    translations.on("languageChanged", onLanguageChanged);

    return () => translations.off("languageChanged", onLanguageChanged);
  }, [setInnerLanguage]);

  const setLanguage = useCallback(
    async (language: string) => {
      setUserSettings({
        language,
      });
      await translations.changeLanguage(language);
    },
    [setUserSettings]
  );

  return [innerLanguage, setLanguage];
};
