import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { ArchifiltreError } from "../../../util/error/error-util";
import { Table } from "../../common/table/table";
import type { Column } from "../../common/table/table-types";

export interface ErrorsTableProps {
    errors: ArchifiltreError[];
}

export const ErrorsTable: React.FC<ErrorsTableProps> = ({ errors }) => {
    const { t } = useTranslation();

    const columns: Column<ArchifiltreError>[] = useMemo(
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
                accessor: ({ code }): string =>
                    t(`errorsModal.errorDescriptions.${code}`),
                id: "description",
                name: t("errorsModal.errorDescription"),
            },
        ],
        [t]
    );
    return <Table rowId="filePath" data={errors} columns={columns} />;
};
