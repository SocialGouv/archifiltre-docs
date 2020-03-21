import dateFormat from "dateformat";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getType } from "../../util/file-and-folders-utils";
import { octet2HumanReadableFormat } from "../main-space/ruler";
import Table from "../common/table";

type FilesAndFoldersTableItem = {
  name: string;
  type: string;
  file_size: string;
  file_last_modified: string;
  id: string;
};

const getData = (filesAndFolders) =>
  Object.values(filesAndFolders)
    .filter(({ id }) => id)
    .map((fileOrFolder: FilesAndFoldersTableItem) => {
      return {
        name: fileOrFolder.name,
        fileSize: octet2HumanReadableFormat(fileOrFolder.file_size),
        lastModified: dateFormat(fileOrFolder.file_last_modified, "dd/mm/yyyy"),
        path: fileOrFolder.id,
        type: getType(fileOrFolder),
      };
    });

export const FilesAndFoldersTable = ({ filesAndFolders }) => {
  const { t } = useTranslation();
  const data = useMemo(() => getData(filesAndFolders), [filesAndFolders]);
  const columns = useMemo(
    () => [
      {
        Header: t("search.name"),
        accessor: "name",
      },
      {
        Header: t("search.type"),
        accessor: "type",
      },
      {
        Header: t("search.size"),
        accessor: "fileSize",
      },
      {
        Header: t("search.fileLastModified"),
        accessor: "lastModified",
      },
      {
        Header: t("search.path"),
        accessor: "path",
      },
    ],
    [t]
  );
  return <Table columns={columns} data={data} />;
};
