import { type ArchifiltreDocsError } from "@common/utils/error";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Table } from "../../common/table/table";
import { type Column } from "../../common/table/table-types";

export interface ErrorsTableProps {
  errors: ArchifiltreDocsError[];
}

export const ErrorsTable: React.FC<ErrorsTableProps> = ({ errors }) => {
  const { t } = useTranslation();

  const columns: Array<Column<ArchifiltreDocsError>> = useMemo(
    () => [
      {
        accessor: "filePath",
        id: "filePath",
        name: t("errorsModal.element"),
      },
      {
        accessor: "code",
        id: "code",
        name: t("errorsModal.errorCode"),
      },
      {
        accessor: ({ code }): string => t(`errorsModal.errorDescriptions.${code}`),
        id: "description",
        name: t("errorsModal.errorDescription"),
      },
    ],
    [t],
  );
  return <Table rowId="filePath" data={errors} columns={columns} />;
};
