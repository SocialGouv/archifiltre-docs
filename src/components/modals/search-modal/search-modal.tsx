import { Box } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import { compose, omit, values } from "lodash/fp";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { useSearchAndFilters } from "hooks/use-search-and-filters";
import { TagMap } from "reducers/tags/tags-types";
import { useStyles } from "hooks/use-styles";
import styled from "styled-components";
import { FilesAndFoldersTable } from "./files-and-folders-table";
import ModalHeader from "../modal-header";
import { FilterMethod } from "typings/filter-types";
import Filters from "./filters/filters";
import { SearchBar } from "./search-bar";
import DialogContent from "@material-ui/core/DialogContent";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { useDebouncedSearchFilter } from "hooks/use-debounced-search-filter";

const StyledPaper = styled(Paper)`
  min-height: 90%;
`;

type SearchModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  tags: TagMap;
};

export const SearchModal: FC<SearchModalProps> = ({
  isModalOpen,
  closeModal,
  filesAndFolders,
  filesAndFoldersMetadata,
  tags,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const filesAndFoldersArray = useMemo(
    () => compose(values, omit(""))(filesAndFolders),
    [filesAndFolders]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterMethod<FilesAndFolders>[]>([]);

  const nameFilter = useDebouncedSearchFilter<FilesAndFolders>(
    "name",
    searchTerm
  );

  const searchFilters = useMemo(() => [nameFilter].concat(filters), [
    nameFilter,
    filters,
  ]);

  /**
   * Resets the filters when the modal closes
   */
  useEffect(() => {
    if (!isModalOpen) {
      setSearchTerm("");
      setFilters([]);
    }
  }, [isModalOpen, setSearchTerm, setFilters]);

  const filteredFilesAndFolders = useSearchAndFilters(
    filesAndFoldersArray,
    searchFilters
  );

  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperComponent={StyledPaper}
    >
      <ModalHeader title={t("search.title")} onClose={closeModal} />
      <DialogContent className={classes.dialogContent} dividers>
        <Box display="flex" flexDirection="column">
          <Box>
            <Box display="flex">
              <Box
                flex={1}
                display="flex"
                alignItems="flex-end"
                paddingBottom={1}
              >
                <SearchBar value={searchTerm} setSearchTerm={setSearchTerm} />
              </Box>
              <Box flex={1}>
                <Filters
                  setFilters={setFilters}
                  filesAndFolders={filesAndFoldersArray}
                  tags={tags}
                />
              </Box>
            </Box>
          </Box>
          <FilesAndFoldersTable
            filesAndFolders={filteredFilesAndFolders}
            filesAndFoldersMetadata={filesAndFoldersMetadata}
            closeModal={closeModal}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
