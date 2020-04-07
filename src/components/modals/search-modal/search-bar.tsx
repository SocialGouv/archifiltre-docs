import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

interface SearchBarProps {
  setSearchTerm: (searchTerm: string) => void;
}

const StyledSearchBar = styled.input`
  border: none;
  border: solid 1px #ccc;
  border-radius: 5px;
`;

export const SearchBar: FC<SearchBarProps> = ({ setSearchTerm }) => {
  const { t } = useTranslation();
  const onChange = useCallback(
    (event) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );
  return (
    <StyledSearchBar
      type="search"
      placeholder={t("search.searchPlaceholder")}
      onChange={onChange}
    />
  );
};
