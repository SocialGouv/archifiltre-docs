import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  setSearchTerm: (searchTerm: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ setSearchTerm }) => {
  const { t } = useTranslation();
  const onChange = useCallback(
    (event) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );
  return (
    <input
      type="text"
      placeholder={t("search.searchPlaceholder")}
      onChange={onChange}
    />
  );
};
