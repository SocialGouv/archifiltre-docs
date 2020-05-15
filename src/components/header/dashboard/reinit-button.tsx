import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import { useStyles } from "hooks/use-styles";

export type ResetWorkspace = () => void;

interface ReinitButtonProps {
  resetWorkspace: ResetWorkspace;
}

const ReinitButton: FC<ReinitButtonProps> = ({ resetWorkspace }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const title = t("header.close");

  return (
    <Tooltip title={title}>
      <Button
        id="reset-workspace-button"
        onClick={resetWorkspace}
        color="primary"
        variant="contained"
        className={classes.headerButton}
        disableElevation
      >
        <FaSignOutAlt />
      </Button>
    </Tooltip>
  );
};

export default ReinitButton;
