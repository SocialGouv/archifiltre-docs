import React, { FC } from "react";
import styled from "styled-components";
import LanguageButton from "./language-button";

interface LanguageListProps {
  setLanguage: (language: string) => void;
  excludeLanguage: string;
}

const availableLanguages = [
  {
    id: "fr",
    name: "Français",
  },
  {
    id: "en",
    name: "English",
  },
  {
    id: "de",
    name: "Deutsch",
  },
];

const LanguageCell = styled.div`
  text-align: center;
  width: 100%;
`;

const LanguageList: FC<LanguageListProps> = ({
  setLanguage,
  excludeLanguage,
}) => {
  return (
    <div className="grid-x">
      {availableLanguages
        .filter(({ id }) => id !== excludeLanguage)
        .map(({ id }) => (
          <LanguageCell key={`language-${id}`}>
            <LanguageButton languageName={id} onClick={() => setLanguage(id)} />
          </LanguageCell>
        ))}
    </div>
  );
};

export default LanguageList;
