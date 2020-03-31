import React, { FC, useCallback } from "react";
import { useLanguage } from "../../../translations/useLanguage";

const availableLanguages = [
  {
    value: "fr",
    label: "🇫🇷 Français",
  },
  {
    value: "en",
    label: "🇬🇧 English",
  },
  {
    value: "de",
    label: "🇩🇪 Deutsch",
  },
];

const LanguagePicker: FC = () => {
  const [language, setLanguage] = useLanguage();

  const onChange = useCallback((event) => setLanguage(event.target.value), []);

  return (
    <select onChange={onChange} value={language}>
      {availableLanguages.map((availableLanguage) => (
        <option value={availableLanguage.value}>
          {availableLanguage.label}
        </option>
      ))}
    </select>
  );
};

export default LanguagePicker;
