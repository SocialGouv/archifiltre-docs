import InputBase from "@material-ui/core/InputBase";
import InputAdornment from "@material-ui/core/InputAdornment";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { useStyles } from "hooks/use-styles";

type SearchBarProps = {
  setSearchTerm: (searchTerm: string) => void;
};

export const SearchBar: FC<SearchBarProps> = ({ setSearchTerm }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const onChange = useCallback(
    (event) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  return (
    <InputBase
      fullWidth
      margin="dense"
      className={classes.searchInput}
      type="search"
      placeholder={t("search.searchPlaceholder")}
      onChange={onChange}
      startAdornment={
        <InputAdornment position="start">
          <FaSearch />
        </InputAdornment>
      }
    />
  );
};
