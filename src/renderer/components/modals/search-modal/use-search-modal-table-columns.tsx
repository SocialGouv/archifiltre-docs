import dateFormat from "dateformat";
import type { TFunction } from "i18next";
import React, { useMemo } from "react";

import type {
  ElementWithToDelete,
  FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { bytes2HumanReadableFormat, isFile } from "../../../utils";
import { getType } from "../../../utils/file-and-folders";
import type { Column } from "../../common/table/table-types";
import { ToDeleteChip } from "../../common/to-delete-chip";

function notNull<T>(value: T | null): value is T {
  return value !== null;
}

const createCommonColumns = (
  t: TFunction,
  metadata: FilesAndFoldersMetadataMap,
  tagAsToDelete: (id: string) => void,
  untagAsToDelete: (id: string) => void,
  isExport?: boolean
): Column<ElementWithToDelete>[] =>
  [
    isExport // when exported, “path” has to be the first column on the CSV file…
      ? ({
          accessor: "id",
          id: "path",
          name: t("search.path"),
          sortable: true,
        } as Column<ElementWithToDelete>)
      : null,
    {
      accessor: "name",
      id: "name",
      name: t("search.name"),
      sortable: true,
    } as Column<ElementWithToDelete>,
    {
      accessor: (element: FilesAndFolders) =>
        getType(element, {
          folderLabel: t("common.folder"),
          unknownLabel: t("common.unknown"),
        }),
      id: "type",
      name: t("search.type"),
      sortable: true,
    } as Column<ElementWithToDelete>,
    {
      accessor: (element: FilesAndFolders) =>
        isFile(element)
          ? isExport
            ? element.file_size
            : bytes2HumanReadableFormat(element.file_size)
          : isExport
          ? metadata[element.id].childrenTotalSize
          : bytes2HumanReadableFormat(metadata[element.id].childrenTotalSize),
      id: "size",
      name: isExport ? t("search.exportSizeColumn") : t("search.size"),
      sortAccessor: (element: FilesAndFolders) =>
        isFile(element)
          ? element.file_size
          : metadata[element.id].childrenTotalSize,
      sortable: true,
    } as Column<ElementWithToDelete>,
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      accessor: ({ file_last_modified }: FilesAndFolders) =>
        dateFormat(file_last_modified, "dd/mm/yyyy"),
      id: "lastModified",
      name: t("search.fileLastModified"),
      sortAccessor: "file_last_modified",
      sortable: true,
    } as Column<ElementWithToDelete>,
    !isExport // … and on the search modal, “path” is not the first column
      ? ({
          accessor: "id",
          id: "path",
          name: t("search.path"),
          sortable: true,
        } as Column<ElementWithToDelete>)
      : null,
    {
      accessor: ({ id, toDelete }) => (
        <ToDeleteChip
          checked={toDelete}
          onClick={() => {
            if (toDelete) untagAsToDelete(id);
            else tagAsToDelete(id);
          }}
        />
      ),
      id: "toDelete",
      name: t("common.toDelete"),
      textValueAccessor: ({ toDelete }: ElementWithToDelete) =>
        toDelete ? t("common.yes") : t("common.no"),
    } as Column<ElementWithToDelete>,
    !isExport
      ? ({
          accessor: () => "",
          id: "emptyColumn",
          name: "",
          sortable: false,
        } as Column<ElementWithToDelete>)
      : null,
  ].filter(notNull);

export const useSearchModalTableColumns = (
  t: TFunction,
  metadata: FilesAndFoldersMetadataMap,
  tagAsToDelete: (id: string) => void,
  untagAsToDelete: (id: string) => void
): Column<ElementWithToDelete>[] =>
  useMemo(
    () =>
      createCommonColumns(t, metadata, tagAsToDelete, untagAsToDelete, false),
    [t, metadata, tagAsToDelete, untagAsToDelete]
  );

export const useExportTableColumns = (
  t: TFunction,
  metadata: FilesAndFoldersMetadataMap,
  tagAsToDelete: (id: string) => void,
  untagAsToDelete: (id: string) => void
): Column<ElementWithToDelete>[] =>
  useMemo(
    () =>
      createCommonColumns(t, metadata, tagAsToDelete, untagAsToDelete, true),
    [t, metadata, tagAsToDelete, untagAsToDelete]
  );
