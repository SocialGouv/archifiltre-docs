import Box from "@material-ui/core/Box";
import { isEmpty, maxBy } from "lodash";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  ElementWithToDelete,
  FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import { useSearchAndFilters } from "hooks/use-search-and-filters";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import CategoryTitle from "components/common/category-title";
import Table from "components/common/table/table";
import dateFormat from "dateformat";
import { SearchBar } from "components/modals/search-modal/search-bar";
import {
  Column,
  HeaderColumn,
  WordBreak,
} from "components/common/table/table-types";
import { makeTableExpandableRow } from "components/common/table/table-expandable-row";
import { useDebouncedValue } from "hooks/use-debounced-value";
import ToDeleteChip from "components/common/to-delete-chip";

const SEARCH_INPUT_DEBOUNCE = 300;

const HiddenSpan = styled.span`
  visibility: hidden;
`;

type DuplicatesSearchProps = {
  duplicatesList: FilesAndFolders[][];
  elementsToDelete: string[];
  tagAsToDelete: (ids: string[]) => void;
  untagAsToDelete: (ids: string[]) => void;
};

const DuplicatesSearch: FC<DuplicatesSearchProps> = ({
  duplicatesList,
  elementsToDelete,
  tagAsToDelete,
  untagAsToDelete,
}) => {
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

  const data = useMemo(
    () =>
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
        id: "name",
        accessor: (row, index = 0) => row[index].name,
      },
      {
        id: "fileOrFolder",
        accessor: (row, index = 0) =>
          getType(row[index], {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
      },
      {
        id: "fileSize",
        accessor: (row, index = 0) =>
          octet2HumanReadableFormat(row[index].file_size),
      },
      {
        id: "elementsCount",
        accessor: (row) => row.length,
      },
      {
        id: "lastModified",
        accessor: (row, index = 0) =>
          dateFormat(row[index].file_last_modified, "dd/mm/yyyy"),
      },
      {
        id: "path",
        accessor: (row) => (
          <HiddenSpan>
            {maxBy(row, (element) => element.id.length)?.id}
          </HiddenSpan>
        ),
      },
      {
        id: "toDelete",
        accessor: (row) => {
          const ids = row.map(({ id }) => id);
          const checked = row.every(({ toDelete }) => toDelete);
          return (
            <ToDeleteChip
              checked={checked}
              onClick={() => {
                checked ? untagAsToDelete(ids) : tagAsToDelete(ids);
              }}
            />
          );
        },
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
        id: "emptyColumn",
        name: "",
        accessor: () => "",
        sortable: false,
      },
      {
        id: "name",
        name: t("search.name"),
        accessor: (row: FilesAndFolders[], index = 0) => row[index].name,
        sortable: true,
      },
      {
        id: "type",
        name: t("search.type"),
        accessor: (row: FilesAndFolders[], index = 0) =>
          getType(row[index], {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
        sortable: true,
      },
      {
        id: "size",
        name: t("search.size"),
        accessor: (row: FilesAndFolders[], index = 0) =>
          octet2HumanReadableFormat(row[index].file_size),
        sortable: true,
        sortAccessor: (row: FilesAndFolders[], index = 0) =>
          row[index].file_size,
      },
      {
        id: "elementsCount",
        name: t("duplicates.filesNumber"),
        accessor: () => "",
        sortable: true,
        sortAccessor: (row: FilesAndFolders[]) => row.length,
      },
      {
        id: "fileLastModified",
        name: t("search.fileLastModified"),
        accessor: (row: FilesAndFolders[], index = 0) =>
          dateFormat(row[index].file_last_modified, "dd/mm/yyyy"),
        sortable: true,
        sortAccessor: (row: FilesAndFolders[], index = 0) =>
          row[index].file_last_modified,
      },
      {
        id: "id",
        name: t("search.path"),
        accessor: (row: FilesAndFolders[], index = 0) => row[index].id,
        cellStyle: {
          wordBreak: WordBreak.BREAK_ALL,
        },
        sortable: true,
      },
      {
        id: "toDelete",
        name: t("common.toDelete"),
        sortable: false,
        accessor: (row, index = 0) => {
          const { id, toDelete } = row[index];
          return (
            <ToDeleteChip
              checked={toDelete}
              onClick={() => {
                toDelete ? untagAsToDelete([id]) : tagAsToDelete([id]);
              }}
            />
          );
        },
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
            {`${filteredFilesAndFolders.length} ${t("duplicates.elements")}`}
          </CategoryTitle>
        </Box>
        <Box flex={1} paddingLeft={1}>
          <SearchBar value={searchTerm} setSearchTerm={setSearchTerm} />
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
          />
        )}
      </Box>
    </Box>
  );
};

export default DuplicatesSearch;
