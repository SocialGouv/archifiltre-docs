import Table from "../common/table";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArchifiltreError } from "../../reducers/loading-info/loading-info-types";

interface ErrorsTableProps {
  errors: ArchifiltreError[];
}

const ErrorsTable: FC<ErrorsTableProps> = ({ errors }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        Header: t("common.file"),
        accessor: "filePath"
      },
      {
        Header: t("errorsModal.errorCode"),
        accessor: "code"
      },
      {
        Header: t("errorsModal.errorDescription"),
        accessor: ({ code }) => t(`errorsModal.errorDescriptions.${code}`)
      }
    ],
    [t]
  );
  return <Table data={errors} columns={columns} />;
};

export default ErrorsTable;
