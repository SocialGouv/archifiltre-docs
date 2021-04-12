import { TFunction } from "i18next";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import React, { useMemo } from "react";
import {
  ElementWithToDelete,
  FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import dateFormat from "dateformat";
import { Column, WordBreak } from "components/common/table/table-types";
import ToDeleteChip from "components/common/to-delete-chip";

export const useSearchModalTableColumns = (
  t: TFunction,
  metadata: FilesAndFoldersMetadataMap,
  tagAsToDelete: (id: string) => void,
  untagAsToDelete: (id: string) => void
): Column<ElementWithToDelete>[] =>
  useMemo(
    () => [
      {
        id: "name",
        name: t("search.name"),
        accessor: "name",
        sortable: true,
      },
      {
        id: "type",
        name: t("search.type"),
        accessor: (element: FilesAndFolders) =>
          getType(element, {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
        sortable: true,
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
        sortable: true,
        sortAccessor: (element: FilesAndFolders) =>
          isFile(element)
            ? element.file_size
            : metadata[element.id].childrenTotalSize,
      },
      {
        id: "lastModified",
        name: t("search.fileLastModified"),
        accessor: ({ file_last_modified }: FilesAndFolders) =>
          dateFormat(file_last_modified, "dd/mm/yyyy"),
        sortable: true,
        sortAccessor: "file_last_modified",
      },
      {
        id: "path",
        name: t("search.path"),
        accessor: "id",
        sortable: true,
        cellStyle: {
          wordBreak: WordBreak.BREAK_ALL,
        },
      },
      {
        id: "toDelete",
        name: t("common.toDelete"),
        accessor: ({ id, toDelete }: ElementWithToDelete) => (
          <ToDeleteChip
            checked={toDelete}
            onClick={() => {
              toDelete ? untagAsToDelete(id) : tagAsToDelete(id);
            }}
          />
        ),
        textValueAccessor: ({ toDelete }: ElementWithToDelete) =>
          toDelete ? t("common.yes") : t("common.no"),
      },
      {
        id: "emptyColumn",
        name: "",
        accessor: () => "",
        sortable: false,
      },
    ],
    [t, metadata]
  );
