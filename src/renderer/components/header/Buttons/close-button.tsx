import type { VoidFunction } from "@common/utils/function";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";

import { useStyles } from "../../../hooks/use-styles";

export interface CloseButtonProps {
  resetWorkspace: VoidFunction;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ resetWorkspace }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const onCloseClick = useCallback(() => {
    resetWorkspace();
  }, [resetWorkspace]);

  const closeTitle = t("header.close");

  return (
    <>
      <Tooltip title={closeTitle}>
        <Button
          id="settings-button"
          color="secondary"
          variant="contained"
          className={classes.headerButton}
          onClick={onCloseClick}
          disableElevation
        >
          <FaSignOutAlt />
        </Button>
      </Tooltip>
    </>
  );
};
