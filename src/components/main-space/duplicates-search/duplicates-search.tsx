import Box from "@material-ui/core/Box";
import { isEmpty, maxBy } from "lodash";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { useSearchAndFilters } from "hooks/use-search-and-filters";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import CategoryTitle from "components/common/category-title";
import Table from "components/common/table/table";
import dateFormat from "dateformat";
import { SearchBar } from "components/modals/search-modal/search-bar";
import { Column } from "components/common/table/table-types";
import { makeTableExpandableRow } from "components/common/table/table-expandable-row";
import { useDebouncedValue } from "hooks/use-debounced-value";

const SEARCH_INPUT_DEBOUNCE = 300;

const HiddenSpan = styled.span`
  visibility: hidden;
`;

type DuplicatesSearchProps = {
  duplicatesList: FilesAndFolders[][];
};

const DuplicatesSearch: FC<DuplicatesSearchProps> = ({ duplicatesList }) => {
  const { t } = useTranslation();

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

  const headerProps = useMemo(
    () => [
      {
        accessor: (row: FilesAndFolders[], index = 0) => row[index].name,
      },
      {
        accessor: (row: FilesAndFolders[], index = 0) =>
          getType(row[index], {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
      },
      {
        accessor: (row: FilesAndFolders[], index = 0) =>
          octet2HumanReadableFormat(row[index].file_size),
      },
      {
        accessor: (row) => row.length,
      },
      {
        accessor: (row: FilesAndFolders[], index = 0) =>
          dateFormat(row[index].file_last_modified, "dd/mm/yyyy"),
      },
      {
        id: "path",
        accessor: (row: FilesAndFolders[]) => (
          <HiddenSpan>
            {maxBy(row, (element) => element.id.length)?.id}
          </HiddenSpan>
        ),
      },
    ],
    [t]
  );

  const TableExpandableRow = useMemo(
    () => makeTableExpandableRow(headerProps),
    [headerProps]
  );

  const columns: Column<FilesAndFolders[]>[] = useMemo(
    () => [
      {
        id: "emptyColumn",
        name: "",
        accessor: () => "",
      },
      {
        id: "name",
        name: t("search.name"),
        accessor: (row: FilesAndFolders[], index = 0) => row[index].name,
      },
      {
        id: "type",
        name: t("search.type"),
        accessor: (row: FilesAndFolders[], index = 0) =>
          getType(row[index], {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
      },
      {
        id: "size",
        name: t("search.size"),
        accessor: (row: FilesAndFolders[], index = 0) =>
          octet2HumanReadableFormat(row[index].file_size),
      },
      {
        id: "elementsCount",
        name: t("duplicates.filesNumber"),
        accessor: () => "",
      },
      {
        id: "fileLastModified",
        name: t("search.fileLastModified"),
        accessor: (row: FilesAndFolders[], index = 0) =>
          dateFormat(row[index].file_last_modified, "dd/mm/yyyy"),
      },
      {
        id: "id",
        name: t("search.path"),
        accessor: (row: FilesAndFolders[], index = 0) => row[index].id,
      },
    ],
    [t]
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" justifyContent="space-between" pt={1} pb={1}>
        <Box flex={1} display="flex" alignItems="center">
          <CategoryTitle>
            {t("duplicates.duplicatesList")}&nbsp;-&nbsp;
            {`${filteredFilesAndFolders.length} ${t("duplicates.elements")}`}
          </CategoryTitle>
        </Box>
        <Box flex={1} paddingLeft={1}>
          <SearchBar setSearchTerm={setSearchTerm} />
        </Box>
      </Box>
      <Box flexGrow={1} minHeight={0} overflow="auto">
        {isEmpty(filteredFilesAndFolders) ? (
          <span>{t("search.noResult")}</span>
        ) : (
          <Table
            columns={columns}
            data={filteredFilesAndFolders}
            RowRendererComp={TableExpandableRow}
          />
        )}
      </Box>
    </Box>
  );
};

export default DuplicatesSearch;
