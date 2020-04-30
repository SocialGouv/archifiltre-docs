import dateFormat from "dateformat";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import Table from "../../common/table";
import { isEmpty } from "lodash";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";

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
        fileSize: octet2HumanReadableFormat(+fileOrFolder.file_size),
        lastModified: dateFormat(fileOrFolder.file_last_modified, "dd/mm/yyyy"),
        path: fileOrFolder.id,
        type: getType(fileOrFolder),
      };
    });

export const FilesAndFoldersTable = ({ filesAndFolders }) => {
  const { t } = useTranslation();
  const data = useMemo(() => getData(filesAndFolders), [
    getData,
    filesAndFolders,
  ]);
  const columns = useMemo(
    () => [
      {
        name: t("search.name"),
        accessor: "name",
      },
      {
        name: t("search.type"),
        accessor: "type",
      },
      {
        name: t("search.size"),
        accessor: "fileSize",
      },
      {
        name: t("search.fileLastModified"),
        accessor: "lastModified",
      },
      {
        name: t("search.path"),
        accessor: "path",
      },
    ],
    [t]
  );
  return isEmpty(filesAndFolders) ? (
    <span>{t("search.noResult")}</span>
  ) : (
    <Table columns={columns} data={data} />
  );
};
