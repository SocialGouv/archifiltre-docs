import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersTable } from "./files-and-folders-table";
import ModalHeader from "../modals/modal-header";
import { SearchBar } from "./search-bar";
import { useSearch } from "./use-search";

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
  const filesAndFoldersArray = useMemo(() => Object.values(filesAndFolders), [
    filesAndFolders,
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFilesAndFolders = useSearch(filesAndFoldersArray, searchTerm);

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalHeader title={t("search.title")} onClose={closeModal} />
      <SearchBar setSearchTerm={setSearchTerm} />
      <FilesAndFoldersTable filesAndFolders={filteredFilesAndFolders} />
    </Modal>
  );
};
