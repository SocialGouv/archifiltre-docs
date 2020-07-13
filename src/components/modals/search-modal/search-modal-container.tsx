import React from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../../../reducers/tags/tags-selectors";
import { SearchModal } from "./search-modal";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";

export const SearchModalContainer = ({ isModalOpen, closeModal }) => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const tags = useSelector(getTagsFromStore);

  return (
    <SearchModal
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      tags={tags}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
};
