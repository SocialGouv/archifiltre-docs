import Box from "@material-ui/core/Box";
import { isEmpty } from "lodash";
import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { useSearchAndFilters } from "../../../hooks/use-search-and-filters";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import CategoryTitle from "../../common/category-title";
import Table from "../../common/table";
import dateFormat from "dateformat";
import { SearchBar } from "../../modals/search-modal/search-bar";

type DuplicatesSearchProps = {
  duplicatesList;
};

const DuplicatesSearch: FC<DuplicatesSearchProps> = ({ duplicatesList }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFilesAndFolders = useSearchAndFilters(
    duplicatesList,
    searchTerm,
    []
  );

  const columns = useMemo(
    () => [
      {
        name: t("search.name"),
        accessor: "name",
      },
      {
        name: t("search.type"),
        accessor: (element: FilesAndFolders) =>
          getType(element, {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
      },
      {
        name: t("search.size"),
        accessor: ({ file_size }: FilesAndFolders) =>
          octet2HumanReadableFormat(file_size),
      },
      {
        name: t("search.fileLastModified"),
        accessor: ({ file_last_modified }: FilesAndFolders) =>
          dateFormat(file_last_modified, "dd/mm/yyyy"),
      },
      {
        name: t("search.path"),
        accessor: "id",
      },
    ],
    [t]
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" justifyContent="space-between" pt={1} pb={1}>
        <CategoryTitle>
          {t("duplicates.duplicatesList")}&nbsp;-&nbsp;
          {`${filteredFilesAndFolders.length} ${t("duplicates.elements")}`}
        </CategoryTitle>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box flexGrow={1} minHeight={0} overflow="auto">
        {isEmpty(filteredFilesAndFolders) ? (
          <span>{t("search.noResult")}</span>
        ) : (
          <Table columns={columns} data={filteredFilesAndFolders} />
        )}
      </Box>
    </Box>
  );
};

export default DuplicatesSearch;
