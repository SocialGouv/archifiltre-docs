import dateFormat from "dateformat";
import type { TFunction } from "i18next";
import React, { useMemo } from "react";

import { isFile } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  ElementWithToDelete,
  FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getType } from "../../../utils/file-and-folders-utils";
import { octet2HumanReadableFormat } from "../../../utils/file-system/file-sys-util";
import type { Column } from "../../common/table/table-types";
import { WordBreak } from "../../common/table/table-types";
import { ToDeleteChip } from "../../common/to-delete-chip";

export const useSearchModalTableColumns = (
  t: TFunction,
  metadata: FilesAndFoldersMetadataMap,
  tagAsToDelete: (id: string) => void,
  untagAsToDelete: (id: string) => void
): Column<ElementWithToDelete>[] =>
  useMemo(
    (): Column<ElementWithToDelete>[] => [
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
          octet2HumanReadableFormat(
            isFile(element)
              ? element.file_size
              : metadata[element.id].childrenTotalSize
          ),
        id: "size",
        name: t("search.size"),
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
      {
        accessor: "id",
        cellStyle: {
          wordBreak: WordBreak.BREAK_ALL,
        },
        id: "path",
        name: t("search.path"),
        sortable: true,
      } as Column<ElementWithToDelete>,
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
      {
        accessor: () => "",
        id: "emptyColumn",
        name: "",
        sortable: false,
      },
    ],
    [t, metadata, tagAsToDelete, untagAsToDelete]
  );
