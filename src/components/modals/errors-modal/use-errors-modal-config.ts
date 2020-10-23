import { TFunction } from "i18next";
import { useMemo } from "react";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";
import { Column } from "components/common/table/table-types";

export const useErrorsModalConfig = (
  t: TFunction
): Column<ArchifiltreError>[] =>
  useMemo(
    () => [
      {
        id: "filePath",
        name: t("errorsModal.element"),
        accessor: "filePath",
        sortable: true,
      },
      {
        id: "code",
        name: t("errorsModal.errorCode"),
        accessor: "code",
        sortable: true,
      },
      {
        id: "description",
        name: t("errorsModal.errorDescription"),
        accessor: ({ code }) =>
          t(`errorsModal.errorDescriptions.${code}`) as string,
        sortable: true,
      },
    ],
    [t]
  );
