import Select from "@material-ui/core/Select";
import React, { FC, useCallback } from "react";
import { useLanguage } from "hooks/use-language";
import { Language } from "util/language/language-types";

const availableLanguages = [
  {
    value: Language.FR,
    label: "🇫🇷 Français",
  },
  {
    value: Language.EN,
    label: "🇬🇧 English",
  },
  {
    value: Language.DE,
    label: "🇩🇪 Deutsch",
  },
];

const LanguagePicker: FC = () => {
  const [language, setLanguage] = useLanguage();

  const onChange = useCallback((event) => setLanguage(event.target.value), []);

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

export default LanguagePicker;
