import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import { compose, omit, values } from "lodash/fp";
import React, { FC, useMemo, useState } from "react";
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

const StyledPaper = styled(Paper)`
  min-height: 90%;
`;

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
  const classes = useStyles();
  const filesAndFoldersArray = useMemo(
    () => compose(values, omit(""))(filesAndFolders),
    [filesAndFolders]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterMethod<FilesAndFolders>[]>([]);
  const filteredFilesAndFolders = useSearchAndFilters(
    filesAndFoldersArray,
    searchTerm,
    filters
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
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <SearchBar setSearchTerm={setSearchTerm} />
              <Filters
                setFilters={setFilters}
                filesAndFolders={filesAndFoldersArray}
                tags={tags}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FilesAndFoldersTable filesAndFolders={filteredFilesAndFolders} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
