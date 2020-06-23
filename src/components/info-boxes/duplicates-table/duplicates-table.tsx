import Box from "@material-ui/core/Box";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import CategoryTitle from "../../common/category-title";
import Table from "../../common/table";
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
      Object.entries(fileTypesCount).map(([fileType, fileTypeValue]) => {
        return {
          type: <DuplicatesTableType fileType={fileType} />,
          nbFiles: fileTypeValue,
          size: octet2HumanReadableFormat(fileSizesCount[fileType]),
          percentage: `${filePercentagesCount[fileType]} %`,
        };
      }),
    [fileTypesCount, fileSizesCount, filePercentagesCount]
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <CategoryTitle>{t("duplicates.duplicatesByType")}</CategoryTitle>
      </Box>
      <Box flexGrow={1}>
        <Table
          columns={columns}
          data={data}
          isPaginatorDisplayed={false}
          isDense={true}
        />
      </Box>
    </Box>
  );
};

export default DuplicatesTable;
