import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AllTagsModal from "components/modals/all-tags-modal/all-tags-modal";
import { useModal } from "hooks/use-modal";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTags } from "react-icons/fa";

const AllTagsButton: FC = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const { t } = useTranslation();
    const title = t("workspace.allTags");

    return (
        <>
            <Tooltip title={title}>
                <IconButton
                    id="all-tags-button"
                    size="small"
                    onClick={openModal}
                >
                    <FaTags />
                </IconButton>
            </Tooltip>
            <AllTagsModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </>
    );
};

export default AllTagsButton;
