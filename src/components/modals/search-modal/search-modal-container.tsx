import React from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { SearchModal } from "./search-modal";

export const SearchModalContainer = ({ isModalOpen, closeModal }) => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  return (
    <SearchModal
      filesAndFolders={filesAndFolders}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
};
