import React, { FC } from "react";
import { FaTimes } from "react-icons/fa";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { useStyles } from "hooks/use-styles";

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose }) => {
  const classes = useStyles();
  return (
    <MuiDialogTitle>
      <div>{title}</div>
      {onClose ? (
        <IconButton
          size="small"
          className={classes.closeButton}
          onClick={onClose}
        >
          <FaTimes />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default ModalHeader;
