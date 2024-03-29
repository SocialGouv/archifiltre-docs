import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { ElementWithToDelete } from "../../../reducers/files-and-folders/files-and-folders-types";
import { makeTableActionRow } from "../../common/table/action-row";
import { Table } from "../../common/table/table";
import type { Column } from "../../common/table/table-types";

export interface FilesAndFoldersTableProps {
  closeModal: () => void;
  columns: Column<ElementWithToDelete>[];
  filesAndFolders: ElementWithToDelete[];
  onPageChange?: (page: number) => void;
  page?: number;
}

export const FilesAndFoldersTable: React.FC<FilesAndFoldersTableProps> = ({
  columns,
  filesAndFolders,
  closeModal,
  page,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const TableActionRow = useMemo(
    () => makeTableActionRow(closeModal),
    [closeModal]
  );

  return isEmpty(filesAndFolders) ? (
    <span>{t("search.noResult")}</span>
  ) : (
    <Table
      stickyHeader={true}
      rowId="id"
      columns={columns}
      data={filesAndFolders}
      RowRendererComp={TableActionRow}
      page={page}
      onPageChange={onPageChange}
    />
  );
};
