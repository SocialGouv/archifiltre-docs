import type { VoidFunction } from "@common/utils/function";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FaTimes } from "react-icons/fa";

import { useStyles } from "../../hooks/use-styles";

export interface ModalHeaderProps {
  closeButtonAriaLabel?: string;
  onClose?: VoidFunction;
  title: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  closeButtonAriaLabel,
}) => {
  const classes = useStyles();
  return (
    <MuiDialogTitle disableTypography>
      <Typography variant="h5">{title}</Typography>
      {onClose ? (
        <IconButton
          size="small"
          className={classes.closeButton}
          onClick={onClose}
          aria-label={closeButtonAriaLabel}
        >
          <FaTimes />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};
