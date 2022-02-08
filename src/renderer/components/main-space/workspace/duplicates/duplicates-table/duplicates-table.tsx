import Box from "@material-ui/core/Box";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { octet2HumanReadableFormat } from "../../../../../util/file-system/file-sys-util";
import type { FileType } from "../../../../../util/file-types/file-types-util";
import { Table } from "../../../../common/table/table";
import type { Column } from "../../../../common/table/table-types";
import { DuplicatesTableType } from "./duplicates-table-type";

type NumberMap<T extends string = string> = Record<T, number>;

interface TableData {
  fileType: FileType;
  nbFiles: number;
  size: number;
  percentage: number;
}

export interface DuplicatesTableProps {
  fileTypesCount: NumberMap<FileType>;
  fileSizesCount: NumberMap;
  filePercentagesCount: NumberMap;
}

export const DuplicatesTable: React.FC<DuplicatesTableProps> = ({
  fileTypesCount,
  fileSizesCount,
  filePercentagesCount,
}) => {
  const { t } = useTranslation();

  const columns: Column<TableData>[] = useMemo(
    () => [
      {
        accessor: ({ fileType }) => <DuplicatesTableType fileType={fileType} />,
        id: "type",
        name: t("search.type"),
        sortable: true,
      },
      {
        accessor: "nbFiles",
        id: "nbFiles",
        name: t("duplicates.filesNumber"),
        sortable: true,
      },
      {
        accessor: ({ size }) => octet2HumanReadableFormat(size),
        id: "size",
        name: t("duplicates.spaceUsed"),
        sortAccessor: "size",
        sortable: true,
      },
      {
        accessor: ({ percentage }) => `${percentage || "<0.01"} %`,
        id: "percentage",
        name: t("duplicates.percentage"),
        sortAccessor: "percentage",
        sortable: true,
      },
    ],
    [t]
  );

  const data = useMemo<TableData[]>(
    () =>
      (Object.entries(fileTypesCount) as [FileType, number][])
        .sort(([, firstValue], [, secondValue]) => secondValue - firstValue)
        .map(([fileType, fileTypeValue]) => {
          return {
            fileType: fileType,
            nbFiles: fileTypeValue,
            percentage: filePercentagesCount[fileType],
            size: fileSizesCount[fileType],
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
