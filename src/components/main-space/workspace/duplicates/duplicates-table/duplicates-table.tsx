import Box from "@material-ui/core/Box";
import Table from "components/common/table/table";
import type { Column } from "components/common/table/table-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";

import DuplicatesTableType from "./duplicates-table-type";

type NumberMap = Record<string, number>;

interface TableData {
    fileType: string;
    nbFiles: number;
    size: number;
    percentage: number;
}

interface DuplicatesTableProps {
    fileTypesCount: NumberMap;
    fileSizesCount: NumberMap;
    filePercentagesCount: NumberMap;
}

const DuplicatesTable: React.FC<DuplicatesTableProps> = ({
    fileTypesCount,
    fileSizesCount,
    filePercentagesCount,
}) => {
    const { t } = useTranslation();

    const columns: Column<TableData>[] = useMemo(
        () => [
            {
                accessor: ({ fileType }) => (
                    <DuplicatesTableType fileType={fileType} />
                ),
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
            Object.entries(fileTypesCount)
                .sort(
                    (
                        [, firstValue]: [any, number],
                        [, secondValue]: [any, number]
                    ) => secondValue - firstValue
                )
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

export default DuplicatesTable;
