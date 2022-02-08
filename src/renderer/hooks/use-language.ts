import { useCallback, useEffect, useState } from "react";

import { translations } from "../translations/translations";
import type { Language } from "../util/language/language-types";
import { useUserSettings } from "./use-user-settings";

/**
 * Hook that allows to get and change the application language
 */
export const useLanguage = (): [Language, (language: Language) => void] => {
  const [innerLanguage, setInnerLanguage] = useState<Language>(
    translations.language as Language
  );
  const { setUserSettings } = useUserSettings();

  useEffect(() => {
    const onLanguageChanged = (lang: Language) => {
      setInnerLanguage(lang);
    };
    translations.on("languageChanged", onLanguageChanged);

    return () => {
      translations.off("languageChanged", onLanguageChanged);
    };
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
