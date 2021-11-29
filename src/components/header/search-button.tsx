import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { SearchModalContainer } from "components/modals/search-modal/search-modal-container";
import { useModal } from "hooks/use-modal";
import { useStyles } from "hooks/use-styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

export const SearchButton = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const classes = useStyles();
    const { t } = useTranslation();
    const title = t("search.title");

    return (
        <>
            <Tooltip title={title}>
                <Button
                    id="search-button"
                    color="primary"
                    variant="outlined"
                    className={classes.headerButton}
                    onClick={openModal}
                    disableElevation
                >
                    <FaSearch />
                </Button>
            </Tooltip>
            <SearchModalContainer
                isModalOpen={isModalOpen}
                closeModal={closeModal}
            />
        </>
    );
};
