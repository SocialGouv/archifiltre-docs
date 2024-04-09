import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaSyncAlt } from "react-icons/fa";

import { useStyles } from "../../hooks/use-styles";

export interface LoadPreviousSessionButtonProps {
  reloadPreviousSession: () => void;
}

export const LoadPreviousSessionButton: React.FC<LoadPreviousSessionButtonProps> = ({ reloadPreviousSession }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const title = t("header.loadPreviousSessionButtonLabel");

  return (
    <Tooltip title={title}>
      <Button
        id="loadPreviousSession"
        color="primary"
        variant="contained"
        className={classes.headerButton}
        onClick={reloadPreviousSession}
        disableElevation
      >
        <FaSyncAlt />
      </Button>
    </Tooltip>
  );
};
