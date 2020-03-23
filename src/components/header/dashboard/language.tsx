import React, { FC } from "react";
import { useLanguage } from "../../../translations/useLanguage";
import { ButtonColor } from "../../common/button";
import TextAlignCenter from "../../common/text-align-center";
import Bubble from "./bubble";
import LanguageButton from "./language/language-button";
import LanguageList from "./language/language-list";

const LanguagePicker: FC = () => {
  const [language, setLanguage] = useLanguage();

  return (
    <Bubble
      backgroundColor={ButtonColor.SUCCESS}
      borderRadius="5px"
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
