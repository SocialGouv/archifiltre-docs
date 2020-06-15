import dateFormat from "dateformat";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import Table from "../../common/table";
import { isEmpty } from "lodash";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { FilesAndFolders } from "../../../reducers/files-and-folders/files-and-folders-types";

type FilesAndFoldersTableProps = {
  filesAndFolders: FilesAndFolders[];
};

export const FilesAndFoldersTable: FC<FilesAndFoldersTableProps> = ({
  filesAndFolders,
}) => {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      {
        name: t("search.name"),
        accessor: "name",
      },
      {
        name: t("search.type"),
        accessor: (element: FilesAndFolders) => getType(element),
      },
      {
        name: t("search.size"),
        accessor: ({ file_size }: FilesAndFolders) =>
          octet2HumanReadableFormat(file_size),
      },
      {
        name: t("search.fileLastModified"),
        accessor: ({ file_last_modified }: FilesAndFolders) =>
          dateFormat(file_last_modified, "dd/mm/yyyy"),
      },
      {
        name: t("search.path"),
        accessor: "id",
      },
    ],
    [t]
  );
  return isEmpty(filesAndFolders) ? (
    <span>{t("search.noResult")}</span>
  ) : (
    <Table columns={columns} data={filesAndFolders} />
  );
};
