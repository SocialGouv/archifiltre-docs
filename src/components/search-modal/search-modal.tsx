import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersTable } from "./files-and-folders-table";
import ModalHeader from "../modals/modal-header";

interface SearchModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  filesAndFolders: FilesAndFoldersMap;
}

export const SearchModal: FC<SearchModalProps> = ({
  isModalOpen,
  closeModal,
  filesAndFolders,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalHeader title={t("search.title")} onClose={closeModal} />
      <FilesAndFoldersTable filesAndFolders={filesAndFolders} />
    </Modal>
  );
};
