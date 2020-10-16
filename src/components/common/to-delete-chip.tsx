import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import React, { FC } from "react";
import { FaTrash } from "react-icons/fa";
import Chip from "@material-ui/core/Chip";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toDeleteChip: {
      backgroundColor: theme.palette.error.main,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.error.main,
      },
      color: "white",
      "& > svg": {
        color: "white",
      },
    },
  })
);

type ToDeleteChipProps = {
  checked: boolean;
  onClick: () => void;
};

const ToDeleteChip: FC<ToDeleteChipProps> = ({ checked, onClick }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Chip
      size="small"
      label={t("common.toDelete")}
      className={checked ? classes.toDeleteChip : ""}
      onClick={onClick}
      icon={<FaTrash style={{ height: "50%" }} />}
    />
  );
};

export default ToDeleteChip;
