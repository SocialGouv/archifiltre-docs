import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number
    ) => void;
}

const useStyles = makeStyles({
    div: {
        "& button": {
            fontSize: "1rem",
        },
        marginRight: -12,
        minWidth: 160,
    },
});

export const PaginatorActions = (props: TablePaginationActionsProps) => {
    const { count, page, rowsPerPage, onChangePage } = props;

    const { t } = useTranslation();

    const classes = useStyles();

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.div}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label={t("common.firstPage")}
            >
                <FaAngleDoubleLeft />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label={t("common.previousPage")}
            >
                <FaAngleLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={t("common.nextPage")}
            >
                <FaAngleRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={t("common.lastPage")}
            >
                <FaAngleDoubleRight />
            </IconButton>
        </div>
    );
};
