import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { useModal } from "hooks/use-modal";
import { useStyles } from "hooks/use-styles";
import ExportModal from "../../modals/export-modal/export-modal";

const ExportButton: FC = () => {
  const { t } = useTranslation();
  const { isModalOpen, openModal, closeModal } = useModal();
  const classes = useStyles();
  const title = t("header.export");

  return (
    <>
      <Tooltip title={title}>
        <Button
          id="settings-button"
          color="primary"
          variant="contained"
          className={classes.headerButton}
          onClick={openModal}
          disableElevation
        >
          <FaDownload />
        </Button>
      </Tooltip>
      <ExportModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default ExportButton;
