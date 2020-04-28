import { Grid } from "@material-ui/core";
import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { useSearchAndFilters } from "hooks/use-search-and-filters";
import { TagMap } from "reducers/tags/tags-types";
import { FilesAndFoldersTable } from "./files-and-folders-table";
import ModalHeader from "../modal-header";
import { FilterMethod } from "typings/filter-types";
import Filters from "./filters/filters";
import { SearchBar } from "./search-bar";

interface SearchModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  filesAndFolders: FilesAndFoldersMap;
  tags: TagMap;
}

export const SearchModal: FC<SearchModalProps> = ({
  isModalOpen,
  closeModal,
  filesAndFolders,
  tags,
}) => {
  const { t } = useTranslation();
  const filesAndFoldersArray = useMemo(() => Object.values(filesAndFolders), [
    filesAndFolders,
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterMethod<FilesAndFolders>[]>([]);
  const filteredFilesAndFolders = useSearchAndFilters(
    filesAndFoldersArray,
    searchTerm,
    filters
  );

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalHeader title={t("search.title")} onClose={closeModal} />
      <Grid container spacing={1}>
        <SearchBar setSearchTerm={setSearchTerm} />
        <Filters
          setFilters={setFilters}
          filesAndFolders={filesAndFoldersArray}
          tags={tags}
        />
      </Grid>
      <FilesAndFoldersTable filesAndFolders={filteredFilesAndFolders} />
    </Modal>
  );
};
