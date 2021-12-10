import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";

import { useModal } from "../../hooks/use-modal";
import { useStyles } from "../../hooks/use-styles";
import type { VoidFunction } from "../../util/function/function-util";
import { SettingsModal } from "../modals/settings-modal/settings-modal";

export interface UserButtonProps {
    resetWorkspace: VoidFunction;
}

export const UserButton: React.FC<UserButtonProps> = ({ resetWorkspace }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { isModalOpen, openModal, closeModal } = useModal();

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        },
        [setAnchorEl]
    );

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const onSettingsClick = useCallback(() => {
        handleClose();
        openModal();
    }, [handleClose, openModal]);

    const onCloseClick = useCallback(() => {
        handleClose();
        resetWorkspace();
    }, [handleClose, resetWorkspace]);

    const settingsModalTitle = t("settingsModal.title");

    return (
        <div>
            <Button
                id="settings-button"
                color="secondary"
                variant="contained"
                className={classes.headerButton}
                onClick={handleClick}
                disableElevation
            >
                <FaUser />
            </Button>
            <Menu
                getContentAnchorEl={null}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                }}
                transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
            >
                <MenuItem onClick={onSettingsClick}>
                    <FaCog />
                    &nbsp;{settingsModalTitle}
                </MenuItem>
                <MenuItem onClick={onCloseClick}>
                    <FaSignOutAlt />
                    &nbsp;{t("header.close")}
                </MenuItem>
            </Menu>
            <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
};
