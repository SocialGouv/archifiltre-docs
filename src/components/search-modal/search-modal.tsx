import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/all";
import Modal from "react-modal";
import styled from "styled-components";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersTable } from "./files-and-folders-table";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  cursor: pointer;
`;

interface SearchModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  filesAndFolders: FilesAndFoldersMap;
}

export const SearchModal: FC<SearchModalProps> = ({
  isModalOpen,
  closeModal,
  filesAndFolders
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <HeaderWrapper>
        <h4>{t("search.title")}</h4>
        <CloseButton onClick={closeModal}>
          <FaTimes />
        </CloseButton>
      </HeaderWrapper>
      <FilesAndFoldersTable filesAndFolders={filesAndFolders} />
    </Modal>
  );
};
