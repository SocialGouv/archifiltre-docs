import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useDebouncedSearchFilter } from "../../../hooks/use-debounced-search-filter";
import { useSearchAndFilters } from "../../../hooks/use-search-and-filters";
import { useStyles } from "../../../hooks/use-styles";
import { ROOT_FF_ID } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import type {
    ElementWithToDelete,
    FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import type { TagMap } from "../../../reducers/tags/tags-types";
import type { FilterMethod } from "../../../typings/filter-types";
import type { Column } from "../../common/table/table-types";
import { ModalHeader } from "../modal-header";
import { FilesAndFoldersTable } from "./files-and-folders-table";
import { Filters } from "./filters/filters";
import type { SearchBarProps } from "./search-bar";
import { SearchBar } from "./search-bar";

const StyledPaper = styled(Paper)`
    height: 90%;
`;

export interface SearchModalProps {
    exportToCsv: (data: FilesAndFolders[]) => void;
    isModalOpen: boolean;
    closeModal: () => void;
    columns: Column<ElementWithToDelete>[];
    filesAndFolders: ElementWithToDelete[];
    tags: TagMap;
    toDelete: string[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
    exportToCsv,
    isModalOpen,
    columns,
    closeModal,
    filesAndFolders,
    tags,
    toDelete,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const filesAndFoldersArray = useMemo(
        () => filesAndFolders.filter(({ id }) => id !== ROOT_FF_ID),
        [filesAndFolders]
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<FilterMethod<ElementWithToDelete>[]>(
        []
    );
    const [page, setPage] = useState(0);

    const nameFilter = useDebouncedSearchFilter<ElementWithToDelete>(
        "name",
        searchTerm
    );

    const searchFilters = useMemo(
        () => [nameFilter].concat(filters),
        [nameFilter, filters]
    );

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

    const performSearch: SearchBarProps["setSearchTerm"] = useCallback(
        (searchValue) => {
            setSearchTerm(searchValue);
            setPage(0);
        },
        [setSearchTerm, setPage]
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
                <Box display="flex" flexDirection="column" height="100%">
                    <Box>
                        <Box display="flex">
                            <Box
                                flex={1}
                                display="flex"
                                alignItems="flex-end"
                                paddingBottom={1}
                            >
                                <SearchBar
                                    value={searchTerm}
                                    setSearchTerm={performSearch}
                                />
                            </Box>
                            <Box flex={1}>
                                <Filters
                                    setFilters={setFilters}
                                    filesAndFolders={filesAndFoldersArray}
                                    toDelete={toDelete}
                                    tags={tags}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box flex={1}>
                        <FilesAndFoldersTable
                            filesAndFolders={filteredFilesAndFolders}
                            columns={columns}
                            closeModal={closeModal}
                            page={page}
                            onPageChange={setPage}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    onClick={() => {
                        exportToCsv(filteredFilesAndFolders);
                    }}
                >
                    {t("exportModal.buttonTitle")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
