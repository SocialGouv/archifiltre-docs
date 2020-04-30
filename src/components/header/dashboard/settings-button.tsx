import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";
import { useModal } from "hooks/use-modal";
import { useStyles } from "hooks/use-styles";
import SettingsModal from "../../modals/settings-modal/settings-modal";

const SettingsButton = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const classes = useStyles();
  const { t } = useTranslation();
  const title = t("settingsModal.title");

  return (
    <>
      <Tooltip title={title}>
        <Button
          id="settings-button"
          color="primary"
          variant="contained"
          className={classes.headerButton}
          onClick={openModal}
        >
          <FaCog />
        </Button>
      </Tooltip>

      <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default SettingsButton;
