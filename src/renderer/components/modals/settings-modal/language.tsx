import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetUserSettings } from "../../../hooks/use-user-settings";
import { Language } from "../../../utils/language/types";

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
  const { t } = useTranslation();
  const { userSettings, updateUserSettings } = useGetUserSettings();

  const [language, setLanguage] = useState<string>(userSettings.language);
  const [isButtonDisable, setIsButtonDisable] = useState<boolean>(false);

  const hasSettingChanged = language !== userSettings.language;

  const onChangeLanguage = useCallback(
    (event) => {
      setLanguage(event.target.value as Language);
    },
    [setLanguage]
  );

  return (
    <>
      <Box>
        <Select
          onChange={onChangeLanguage}
          value={language}
          variant="outlined"
          native
        >
          {availableLanguages.map((availableLanguage) => (
            <option
              value={availableLanguage.value}
              key={availableLanguage.value}
            >
              {availableLanguage.label}
            </option>
          ))}
        </Select>
      </Box>
      <Box pt={1}>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          disabled={!hasSettingChanged || isButtonDisable}
          onClick={async () => {
            setIsButtonDisable(true);
            await updateUserSettings({ language });
            setIsButtonDisable(false);
          }}
        >
          {t("common.reload")}
        </Button>
      </Box>
    </>
  );
};
