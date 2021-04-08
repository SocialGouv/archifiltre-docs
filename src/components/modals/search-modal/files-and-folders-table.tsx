import { makeTableActionRow } from "components/common/table/action-row";
import { Column } from "components/common/table/table-types";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Table from "components/common/table/table";
import { isEmpty } from "lodash";
import { ElementWithToDelete } from "reducers/files-and-folders/files-and-folders-types";

type FilesAndFoldersTableProps = {
  columns: Column<ElementWithToDelete>[];
  filesAndFolders: ElementWithToDelete[];
  closeModal: () => void;
  page?: number;
  onPageChange?: (page: number) => void;
};

export const FilesAndFoldersTable: FC<FilesAndFoldersTableProps> = ({
  columns,
  filesAndFolders,
  closeModal,
  page,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const TableActionRow = useMemo(() => makeTableActionRow(closeModal), [
    closeModal,
  ]);

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
