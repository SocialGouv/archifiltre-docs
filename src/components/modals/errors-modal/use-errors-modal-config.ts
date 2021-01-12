import { TFunction } from "i18next";
import { useMemo } from "react";
import { Column } from "components/common/table/table-types";
import { ArchifiltreError } from "util/error/error-util";

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
