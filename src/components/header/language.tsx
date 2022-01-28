import Select from "@material-ui/core/Select";
import React, { useCallback } from "react";

import { useLanguage } from "../../hooks/use-language";
import { Language } from "../../util/language/language-types";

const availableLanguages = [
  {
    label: "🇫🇷 Français",
    value: Language.FR,
  },
  {
    label: "🇬🇧 English",
    value: Language.EN,
  },
  {
    label: "🇩🇪 Deutsch",
    value: Language.DE,
  },
];

export const LanguagePicker: React.FC = () => {
  const [language, setLanguage] = useLanguage();

  const onChange = useCallback(
    (event) => {
      setLanguage(event.target.value as Language);
    },
    [setLanguage]
  );

  return (
    <Select onChange={onChange} value={language} variant="outlined" native>
      {availableLanguages.map((availableLanguage) => (
        <option value={availableLanguage.value} key={availableLanguage.value}>
          {availableLanguage.label}
        </option>
      ))}
    </Select>
  );
};
