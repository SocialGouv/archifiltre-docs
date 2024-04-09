import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaUpload } from "react-icons/fa";

import { useModal } from "../../../hooks/use-modal";
import { useStyles } from "../../../hooks/use-styles";
import { MetadataModalContainer } from "./MetadataModalContainer";

export const MetadataModalButton: React.FC = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const classes = useStyles();
  const { t } = useTranslation();
  const title = t("importModal.title");

  return (
    <>
      <Tooltip title={title}>
        <Button
          id="search-button"
          color="primary"
          variant="outlined"
          className={classes.headerButton}
          onClick={openModal}
          disableElevation
        >
          <FaUpload />
        </Button>
      </Tooltip>
      <MetadataModalContainer isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
