import { Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { useStyles } from "hooks/use-styles";
import { SearchModalContainer } from "components/modals/search-modal/search-modal-container";
import { useModal } from "hooks/use-modal";

export const SearchButton = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const classes = useStyles();
  const { t } = useTranslation();
  const title = t("search.title");

  return (
    <>
      <Tooltip title={title}>
        <Button
          id="search-button"
          color="primary"
          variant="contained"
          className={classes.headerButton}
          onClick={openModal}
        >
          <FaSearch />
        </Button>
      </Tooltip>
      <SearchModalContainer isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
