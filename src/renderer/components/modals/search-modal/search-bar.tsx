import InputAdornment from "@mui/material/InputAdornment";
import InputBase, { type InputBaseProps } from "@mui/material/InputBase";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

import { useStyles } from "../../../hooks/use-styles";

export interface SearchBarProps {
  setSearchTerm: (searchTerm: string) => void;
  value: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, value }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const onChange: NonNullable<InputBaseProps["onChange"]> = useCallback(
    event => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm],
  );

  return (
    <InputBase
      fullWidth
      margin="dense"
      className={classes.searchInput}
      type="search"
      placeholder={t("search.searchPlaceholder")}
      onChange={onChange}
      value={value}
      startAdornment={
        <InputAdornment position="start">
          <FaSearch />
        </InputAdornment>
      }
    />
  );
};
