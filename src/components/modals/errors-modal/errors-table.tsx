import Table from "components/common/table/table";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";

type ErrorsTableProps = {
  errors: ArchifiltreError[];
};

const ErrorsTable: FC<ErrorsTableProps> = ({ errors }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        name: t("errorsModal.element"),
        accessor: "filePath",
      },
      {
        name: t("errorsModal.errorCode"),
        accessor: "code",
      },
      {
        name: t("errorsModal.errorDescription"),
        accessor: ({ code }) => t(`errorsModal.errorDescriptions.${code}`),
      },
    ],
    [t]
  );
  return <Table rowId="filePath" data={errors} columns={columns} />;
};

export default ErrorsTable;
