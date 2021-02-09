import Box from "@material-ui/core/Box";
import { Column } from "components/common/table/table-types";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import Table from "components/common/table/table";
import DuplicatesTableType from "./duplicates-table-type";

type NumberMap = {
  [id: string]: number;
};

type TableData = {
  fileType: string;
  nbFiles: number;
  size: number;
  percentage: number;
};

type DuplicatesTableProps = {
  fileTypesCount: NumberMap;
  fileSizesCount: NumberMap;
  filePercentagesCount: NumberMap;
};

const DuplicatesTable: FC<DuplicatesTableProps> = ({
  fileTypesCount,
  fileSizesCount,
  filePercentagesCount,
}) => {
  const { t } = useTranslation();

  const columns: Column<TableData>[] = useMemo(
    () => [
      {
        id: "type",
        name: t("search.type"),
        accessor: ({ fileType }) => <DuplicatesTableType fileType={fileType} />,
        sortable: true,
      },
      {
        id: "nbFiles",
        name: t("workspace.duplicates.filesNumber"),
        accessor: "nbFiles",
        sortable: true,
      },
      {
        id: "size",
        name: t("workspace.duplicates.spaceUsed"),
        accessor: ({ size }) => octet2HumanReadableFormat(size),
        sortable: true,
        sortAccessor: "size",
      },
      {
        id: "percentage",
        name: t("workspace.duplicates.percentage"),
        accessor: ({ percentage }) => `${percentage || "<0.01"} %`,
        sortable: true,
        sortAccessor: "percentage",
      },
    ],
    [t]
  );

  const data = useMemo<TableData[]>(
    () =>
      Object.entries(fileTypesCount)
        .sort(
          ([, firstValue]: [any, number], [, secondValue]: [any, number]) =>
            secondValue - firstValue
        )
        .map(([fileType, fileTypeValue]) => {
          return {
            fileType: fileType,
            nbFiles: fileTypeValue,
            size: fileSizesCount[fileType],
            percentage: filePercentagesCount[fileType],
          };
        }),
    [fileTypesCount, fileSizesCount, filePercentagesCount]
  );

  return (
    <Box overflow="hidden">
      <Table
        rowId="fileType"
        columns={columns}
        data={data}
        isPaginatorDisplayed={false}
        isDense={true}
      />
    </Box>
  );
};

export default DuplicatesTable;
