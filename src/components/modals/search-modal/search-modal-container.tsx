import React from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../../../reducers/tags/tags-selectors";
import { SearchModal } from "./search-modal";

export const SearchModalContainer = ({ isModalOpen, closeModal }) => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const tags = useSelector(getTagsFromStore);

  return (
    <SearchModal
      filesAndFolders={filesAndFolders}
      tags={tags}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
};
