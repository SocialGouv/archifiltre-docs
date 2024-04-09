import { type VoidFunction } from "@common/utils/function";
import MuiDialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React from "react";
import { FaTimes } from "react-icons/fa";

import { useStyles } from "../../hooks/use-styles";

export interface ModalHeaderProps {
  onClose?: VoidFunction;
  title: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  const classes = useStyles();
  return (
    <MuiDialogTitle disableTypography>
      <Typography variant="h5">{title}</Typography>
      {onClose ? (
        <IconButton size="small" className={classes.closeButton} onClick={onClose}>
          <FaTimes />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};
