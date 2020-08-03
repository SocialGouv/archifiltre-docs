import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { useStyles } from "hooks/use-styles";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";

type SettingsButtonProps = {
  openModal: () => void;
};

const SettingsButton: FC<SettingsButtonProps> = ({ openModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const settingsModalTitle = t("settingsModal.title");

  return (
    <Tooltip title={settingsModalTitle}>
      <Button
        id="settings-button"
        color="secondary"
        variant="contained"
        className={classes.headerButton}
        onClick={openModal}
        disableElevation
      >
        <FaCog />
      </Button>
    </Tooltip>
  );
};

export default SettingsButton;
