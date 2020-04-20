import { useEffect, useState } from "react";
import translations from "translations/translations";

const setLanguage = (language: string) => translations.changeLanguage(language);

/**
 * Hook that allows to get and change the application language
 */
export const useLanguage = (): [string, (language: string) => void] => {
  const [innerLanguage, setInnerLanguage] = useState(translations.language);

  useEffect(() => {
    const onLanguageChanged = (lang) => {
      setInnerLanguage(lang);
    };
    translations.on("languageChanged", onLanguageChanged);

    return () => translations.off("languageChanged", onLanguageChanged);
  }, [setInnerLanguage]);

  return [innerLanguage, setLanguage];
};
