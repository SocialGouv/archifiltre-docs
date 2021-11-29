import type { Column } from "components/common/table/table-types";
import type { TFunction } from "i18next";
import { useMemo } from "react";
import type { ArchifiltreError } from "util/error/error-util";

export const useErrorsModalConfig = (
    t: TFunction
): Column<ArchifiltreError>[] =>
    useMemo(
        () => [
            {
                accessor: "filePath",
                id: "filePath",
                name: t("errorsModal.element"),
                sortable: true,
            },
            {
                accessor: "code",
                id: "code",
                name: t("errorsModal.errorCode"),
                sortable: true,
            },
            {
                accessor: ({ code }) =>
                    t(`errorsModal.errorDescriptions.${code}`),
                id: "description",
                name: t("errorsModal.errorDescription"),
                sortable: true,
            },
        ],
        [t]
    );
