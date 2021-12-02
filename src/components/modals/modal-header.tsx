import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FaTimes } from "react-icons/fa";

import { useStyles } from "../../hooks/use-styles";

interface ModalHeaderProps {
    title: string;
    onClose?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
    const classes = useStyles();
    return (
        <MuiDialogTitle disableTypography>
            <Typography variant="h5">{title}</Typography>
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
