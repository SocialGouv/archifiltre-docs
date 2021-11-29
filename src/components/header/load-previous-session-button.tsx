import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { useStyles } from "hooks/use-styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaSyncAlt } from "react-icons/fa";

interface LoadPreviousSessionButtonProps {
    reloadPreviousSession: () => void;
}

const LoadPreviousSessionButton: React.FC<LoadPreviousSessionButtonProps> = ({
    reloadPreviousSession,
}) => {
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

export default LoadPreviousSessionButton;
