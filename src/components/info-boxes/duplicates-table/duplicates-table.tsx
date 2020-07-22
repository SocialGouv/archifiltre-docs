import Box from "@material-ui/core/Box";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import Table from "components/common/table/table";
import DuplicatesTableType from "./duplicates-table-type";

type DuplicatesTableProps = {
  fileTypesCount;
  fileSizesCount;
  filePercentagesCount;
};

const DuplicatesTable: FC<DuplicatesTableProps> = ({
  fileTypesCount,
  fileSizesCount,
  filePercentagesCount,
}) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        name: t("search.type"),
        accessor: "type",
      },
      {
        name: t("duplicates.filesNumber"),
        accessor: "nbFiles",
      },
      {
        name: t("duplicates.spaceUsed"),
        accessor: "size",
      },
      {
        name: t("duplicates.percentage"),
        accessor: "percentage",
      },
    ],
    [t]
  );

  const data = useMemo(
    () =>
      Object.entries(fileTypesCount)
        .sort(
          ([, firstValue]: [any, number], [, secondValue]: [any, number]) =>
            secondValue - firstValue
        )
        .map(([fileType, fileTypeValue]) => {
          return {
            type: <DuplicatesTableType fileType={fileType} />,
            nbFiles: fileTypeValue,
            size: octet2HumanReadableFormat(fileSizesCount[fileType]),
            percentage: `${filePercentagesCount[fileType] || "<0.01"} %`,
          };
        }),
    [fileTypesCount, fileSizesCount, filePercentagesCount]
  );

  return (
    <Box overflow="hidden">
      <Table
        rowId="type"
        columns={columns}
        data={data}
        isPaginatorDisplayed={false}
        isDense={true}
      />
    </Box>
  );
};

export default DuplicatesTable;
