import Box from "@material-ui/core/Box";
import dateFormat from "dateformat";
import { isEmpty, maxBy } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useDuplicatePageState } from "../../../context/duplicates-page-context";
import { useDebouncedValue } from "../../../hooks/use-debounced-value";
import { useSearchAndFilters } from "../../../hooks/use-search-and-filters";
import type {
    ElementWithToDelete,
    FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import { octet2HumanReadableFormat } from "../../../util/file-system/file-sys-util";
import { getType } from "../../../util/files-and-folders/file-and-folders-utils";
import { CategoryTitle } from "../../common/category-title";
import { Table } from "../../common/table/table";
import { makeTableExpandableRow } from "../../common/table/table-expandable-row";
import type { Column, HeaderColumn } from "../../common/table/table-types";
import { WordBreak } from "../../common/table/table-types";
import { ToDeleteChip } from "../../common/to-delete-chip";
import type { SearchBarProps } from "../../modals/search-modal/search-bar";
import { SearchBar } from "../../modals/search-modal/search-bar";

const SEARCH_INPUT_DEBOUNCE = 300;

const HiddenSpan = styled.span`
    visibility: hidden;
`;

const rowIdAccessor = (row: ElementWithToDelete[]) => row[0].id;

export interface DuplicatesSearchProps {
    duplicatesList: FilesAndFolders[][];
    elementsToDelete: string[];
    tagAsToDelete: (ids: string[]) => void;
    untagAsToDelete: (ids: string[]) => void;
}

export const DuplicatesSearch: React.FC<DuplicatesSearchProps> = ({
    duplicatesList,
    elementsToDelete,
    tagAsToDelete,
    untagAsToDelete,
}) => {
    const { t } = useTranslation();

    const { pageIndex, setPageIndex } = useDuplicatePageState();

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(
        searchTerm,
        SEARCH_INPUT_DEBOUNCE
    );
    const filterName = useCallback(
        (row: FilesAndFolders[]) =>
            row.some((element) =>
                element.name
                    .toLowerCase()
                    .includes(debouncedSearchTerm.trim().toLowerCase())
            ),
        [debouncedSearchTerm]
    );
    const filteredFilesAndFolders = useSearchAndFilters(duplicatesList, [
        filterName,
    ]);

    const performSearch: SearchBarProps["setSearchTerm"] = useCallback(
        (searchValue) => {
            setSearchTerm(searchValue);
            setPageIndex(0);
        },
        [setSearchTerm, setPageIndex]
    );

    const data = useMemo(
        (): ElementWithToDelete[][] =>
            filteredFilesAndFolders.map((filesAndFoldersList) =>
                filesAndFoldersList.map((filesAndFolders) => ({
                    ...filesAndFolders,
                    toDelete: elementsToDelete.includes(filesAndFolders.id),
                }))
            ),
        [filteredFilesAndFolders, elementsToDelete]
    );

    const headerProps: HeaderColumn<ElementWithToDelete[]>[] = useMemo(
        () => [
            {
                accessor: (row, index = 0) => row[index].name,
                id: "name",
            },
            {
                accessor: (row, index = 0) =>
                    getType(row[index], {
                        folderLabel: t("common.folder"),
                        unknownLabel: t("common.unknown"),
                    }),
                id: "fileOrFolder",
            },
            {
                accessor: (row, index = 0) =>
                    octet2HumanReadableFormat(row[index].file_size),
                id: "fileSize",
            },
            {
                accessor: (row) => row.length,
                id: "elementsCount",
            },
            {
                accessor: (row, index = 0) =>
                    dateFormat(row[index].file_last_modified, "dd/mm/yyyy"),
                id: "lastModified",
            },
            {
                accessor: (row) => (
                    <HiddenSpan>
                        {maxBy(row, (element) => element.id.length)?.id}
                    </HiddenSpan>
                ),
                id: "path",
            },
            {
                accessor: (row) => {
                    const ids = row.map(({ id }) => id);
                    const checked = row.every(({ toDelete }) => toDelete);
                    return (
                        <ToDeleteChip
                            checked={checked}
                            onClick={() => {
                                if (checked) untagAsToDelete(ids);
                                else tagAsToDelete(ids);
                            }}
                        />
                    );
                },
                id: "toDelete",
            },
        ],
        [t, untagAsToDelete, tagAsToDelete]
    );

    const TableExpandableRow = useMemo(
        () => makeTableExpandableRow(headerProps),
        [headerProps]
    );

    const columns: Column<ElementWithToDelete[]>[] = useMemo(
        () => [
            {
                accessor: () => "",
                id: "emptyColumn",
                name: "",
                sortable: false,
            },
            {
                accessor: (row: FilesAndFolders[], index = 0) =>
                    row[index].name,
                id: "name",
                name: t("search.name"),
                sortable: true,
            },
            {
                accessor: (row: FilesAndFolders[], index = 0) =>
                    getType(row[index], {
                        folderLabel: t("common.folder"),
                        unknownLabel: t("common.unknown"),
                    }),
                id: "type",
                name: t("search.type"),
                sortable: true,
            },
            {
                accessor: (row: FilesAndFolders[], index = 0) =>
                    octet2HumanReadableFormat(row[index].file_size),
                id: "size",
                name: t("search.size"),
                sortAccessor: (row: FilesAndFolders[], index = 0) =>
                    row[index].file_size,
                sortable: true,
            },
            {
                accessor: () => "",
                id: "elementsCount",
                name: t("duplicates.filesNumber"),
                sortAccessor: (row: FilesAndFolders[]) => row.length,
                sortable: true,
            },
            {
                accessor: (row: FilesAndFolders[], index = 0) =>
                    dateFormat(row[index].file_last_modified, "dd/mm/yyyy"),
                id: "fileLastModified",
                name: t("search.fileLastModified"),
                sortAccessor: (row: FilesAndFolders[], index = 0) =>
                    row[index].file_last_modified,
                sortable: true,
            },
            {
                accessor: (row: FilesAndFolders[], index = 0) => row[index].id,
                cellStyle: {
                    wordBreak: WordBreak.BREAK_ALL,
                },
                id: "id",
                name: t("search.path"),
                sortable: true,
            },
            {
                accessor: (row, index = 0) => {
                    const { id, toDelete } = row[index];
                    return (
                        <ToDeleteChip
                            checked={toDelete}
                            onClick={() => {
                                if (toDelete) untagAsToDelete([id]);
                                else tagAsToDelete([id]);
                            }}
                        />
                    );
                },
                id: "toDelete",
                name: t("common.toDelete"),
                sortable: false,
            },
        ],
        [t, tagAsToDelete, untagAsToDelete]
    );

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" justifyContent="space-between" pt={1} pb={1}>
                <Box flex={1} display="flex" alignItems="center">
                    <CategoryTitle>
                        {t("duplicates.duplicatesList")}&nbsp;-&nbsp;
                        {`${filteredFilesAndFolders.length} ${t(
                            "duplicates.elements"
                        )}`}
                    </CategoryTitle>
                </Box>
                <Box flex={1} paddingLeft={1}>
                    <SearchBar
                        value={searchTerm}
                        setSearchTerm={performSearch}
                    />
                </Box>
            </Box>
            <Box flexGrow={1} minHeight={0}>
                {isEmpty(filteredFilesAndFolders) ? (
                    <span>{t("search.noResult")}</span>
                ) : (
                    <Table
                        stickyHeader={true}
                        columns={columns}
                        data={data}
                        RowRendererComp={TableExpandableRow}
                        rowId={rowIdAccessor}
                        page={pageIndex}
                        onPageChange={setPageIndex}
                    />
                )}
            </Box>
        </Box>
    );
};
