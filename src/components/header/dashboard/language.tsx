import React, { FC } from "react";
import { useLanguage } from "../../../translations/useLanguage";
import TextAlignCenter from "../../common/text-align-center";
import Bubble from "./bubble";
import LanguageButton from "./language/language-button";
import LanguageList from "./language/language-list";

const LanguagePicker: FC = () => {
  const [language, setLanguage] = useLanguage();

  return (
    <Bubble
      comp={
        <TextAlignCenter>
          <LanguageButton languageName={language} />
        </TextAlignCenter>
      }
      sub_comp={
        <LanguageList setLanguage={setLanguage} excludeLanguage={language} />
      }
    />
  );
};

export default LanguagePicker;
