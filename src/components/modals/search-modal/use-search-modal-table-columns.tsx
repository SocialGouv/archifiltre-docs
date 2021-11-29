import type { Column } from "components/common/table/table-types";
import { WordBreak } from "components/common/table/table-types";
import { ToDeleteChip } from "components/common/to-delete-chip";
import dateFormat from "dateformat";
import type { TFunction } from "i18next";
import React, { useMemo } from "react";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import type {
    ElementWithToDelete,
    FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { getType } from "util/files-and-folders/file-and-folders-utils";

export const useSearchModalTableColumns = (
    t: TFunction,
    metadata: FilesAndFoldersMetadataMap,
    tagAsToDelete: (id: string) => void,
    untagAsToDelete: (id: string) => void
): Column<ElementWithToDelete>[] =>
    useMemo(
        () => [
            {
                accessor: "name",
                id: "name",
                name: t("search.name"),
                sortable: true,
            },
            {
                accessor: (element: FilesAndFolders) =>
                    getType(element, {
                        folderLabel: t("common.folder"),
                        unknownLabel: t("common.unknown"),
                    }),
                id: "type",
                name: t("search.type"),
                sortable: true,
            },
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
            },
            {
                accessor: ({ file_last_modified }: FilesAndFolders) =>
                    dateFormat(file_last_modified, "dd/mm/yyyy"),
                id: "lastModified",
                name: t("search.fileLastModified"),
                sortAccessor: "file_last_modified",
                sortable: true,
            },
            {
                accessor: "id",
                cellStyle: {
                    wordBreak: WordBreak.BREAK_ALL,
                },
                id: "path",
                name: t("search.path"),
                sortable: true,
            },
            {
                accessor: ({ id, toDelete }: ElementWithToDelete) => (
                    <ToDeleteChip
                        checked={toDelete}
                        onClick={() => {
                            toDelete ? untagAsToDelete(id) : tagAsToDelete(id);
                        }}
                    />
                ),
                id: "toDelete",
                name: t("common.toDelete"),
                textValueAccessor: ({ toDelete }: ElementWithToDelete) =>
                    toDelete ? t("common.yes") : t("common.no"),
            },
            {
                accessor: () => "",
                id: "emptyColumn",
                name: "",
                sortable: false,
            },
        ],
        [t, metadata]
    );
