import Table from "components/common/table/table";
import { Column } from "components/common/table/table-types";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";

type ErrorsTableProps = {
  errors: ArchifiltreError[];
};

const ErrorsTable: FC<ErrorsTableProps> = ({ errors }) => {
  const { t } = useTranslation();

  const columns: Column<ArchifiltreError>[] = useMemo(
    () => [
      {
        id: "filePath",
        name: t("errorsModal.element"),
        accessor: "filePath",
      },
      {
        id: "code",
        name: t("errorsModal.errorCode"),
        accessor: "code",
      },
      {
        id: "description",
        name: t("errorsModal.errorDescription"),
        accessor: ({ code }) =>
          t(`errorsModal.errorDescriptions.${code}`) as string,
      },
    ],
    [t]
  );
  return <Table rowId="filePath" data={errors} columns={columns} />;
};

export default ErrorsTable;
