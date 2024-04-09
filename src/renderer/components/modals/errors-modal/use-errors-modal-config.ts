import { type ArchifiltreDocsError } from "@common/utils/error";
import { type TFunction } from "i18next";
import { useMemo } from "react";

import { type Column } from "../../common/table/table-types";

export const useErrorsModalConfig = (t: TFunction): Array<Column<ArchifiltreDocsError>> =>
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
        accessor: ({ code }): string => t(`errorsModal.errorDescriptions.${code}`),
        id: "description",
        name: t("errorsModal.errorDescription"),
        sortable: true,
      },
    ],
    [t],
  );
