import { TFunction } from "i18next";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { useMemo } from "react";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import dateFormat from "dateformat";
import { Column } from "components/common/table/table-types";

export const useSearchModalTableColumns = (
  t: TFunction,
  metadata: FilesAndFoldersMetadataMap
): Column<FilesAndFolders>[] =>
  useMemo(
    () => [
      {
        id: "name",
        name: t("search.name"),
        accessor: "name",
      },
      {
        id: "type",
        name: t("search.type"),
        accessor: (element: FilesAndFolders) =>
          getType(element, {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
      },
      {
        id: "size",
        name: t("search.size"),
        accessor: (element: FilesAndFolders) =>
          octet2HumanReadableFormat(
            isFile(element)
              ? element.file_size
              : metadata[element.id].childrenTotalSize
          ),
      },
      {
        id: "lastModified",
        name: t("search.fileLastModified"),
        accessor: ({ file_last_modified }: FilesAndFolders) =>
          dateFormat(file_last_modified, "dd/mm/yyyy"),
      },
      {
        id: "path",
        name: t("search.path"),
        accessor: "id",
      },
      {
        id: "emptyColumn",
        name: "",
        accessor: () => "",
      },
    ],
    [t, metadata]
  );
