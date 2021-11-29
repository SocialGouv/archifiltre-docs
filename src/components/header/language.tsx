import Select from "@material-ui/core/Select";
import { useLanguage } from "hooks/use-language";
import type { FC } from "react";
import React, { useCallback } from "react";
import { Language } from "util/language/language-types";

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

const LanguagePicker: FC = () => {
    const [language, setLanguage] = useLanguage();

    const onChange = useCallback(
        (event) => setLanguage(event.target.value),
        []
    );

    return (
        <Select onChange={onChange} value={language} variant="outlined" native>
            {availableLanguages.map((availableLanguage) => (
                <option
                    value={availableLanguage.value}
                    key={availableLanguage.value}
                >
                    {availableLanguage.label}
                </option>
            ))}
        </Select>
    );
};

export default LanguagePicker;
