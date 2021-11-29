import Chip from "@material-ui/core/Chip";
import type { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toDeleteChip: {
            "& > svg": {
                color: "white",
            },
            "&:hover, &:focus": {
                backgroundColor: theme.palette.error.main,
            },
            backgroundColor: theme.palette.error.main,
            color: "white",
        },
    })
);

interface ToDeleteChipProps {
    checked: boolean;
    onClick: () => void;
}

export const ToDeleteChip: React.FC<ToDeleteChipProps> = ({
    checked,
    onClick,
}) => {
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
