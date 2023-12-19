import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";

import { useModal } from "../../hooks/use-modal";
import { useStyles } from "../../hooks/use-styles";
import { SettingsModal } from "../modals/settings-modal/settings-modal";

export const UserButton: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { isModalOpen, openModal, closeModal } = useModal();

  const onSettingsClick = useCallback(() => {
    openModal();
  }, [openModal]);

  const settingsTitle = t("header.settings");

  return (
    <>
      <Tooltip title={settingsTitle}>
        <Button
          id="settings-button"
          color="secondary"
          variant="contained"
          className={classes.headerButton}
          onClick={onSettingsClick}
          disableElevation
        >
          <FaCog />
        </Button>
      </Tooltip>
      <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
