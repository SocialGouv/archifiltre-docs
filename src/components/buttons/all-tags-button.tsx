import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";
import AllTagsModal from "../modals/all-tags-modal/all-tags-modal";
import { useModal } from "hooks/use-modal";

interface AllTagsButtonProps {
  api: any;
}

const AllTagsButton: FC<AllTagsButtonProps> = ({ api }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();
  const title = t("workspace.allTags");

  return (
    <>
      <Tooltip title={title}>
        <IconButton id="all-tags-button" size="small" onClick={openModal}>
          <FaCog />
        </IconButton>
      </Tooltip>
      <AllTagsModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        api={api}
      />
    </>
  );
};

export default AllTagsButton;
