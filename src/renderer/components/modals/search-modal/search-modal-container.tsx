import type { Awaitable, VoidFunction } from "@common/utils/function";
import path from "path";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  markAsToDelete,
  unmarkAsToDelete,
} from "../../../reducers/files-and-folders/files-and-folders-actions";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import type { ElementWithToDelete } from "../../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getTagsFromStore } from "../../../reducers/tags/tags-selectors";
import { useWorkspaceMetadata } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { exportTableToCsvFile } from "../../../utils/table";
import type { SearchModalProps } from "./search-modal";
import { SearchModal } from "./search-modal";
import {
  useExportTableColumns,
  useSearchModalTableColumns,
} from "./use-search-modal-table-columns";

export interface SearchModalContainerProps {
  closeModal: SearchModalProps["closeModal"];
  isModalOpen: SearchModalProps["isModalOpen"];
}
export const SearchModalContainer: React.FC<SearchModalContainerProps> = ({
  isModalOpen,
  closeModal,
}) => {
  const { t } = useTranslation();
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const { sessionName, originalPath } = useWorkspaceMetadata();
  const dispatch = useDispatch();
  const tags = useSelector(getTagsFromStore);
  const toDelete = useSelector(getElementsToDeleteFromStore);

  const tagAsToDelete = useCallback(
    (id: string) => {
      dispatch(markAsToDelete(id));
    },
    [dispatch]
  );

  const untagAsToDelete = useCallback(
    (id: string) => {
      dispatch(unmarkAsToDelete(id));
    },
    [dispatch]
  );

  const columns = useSearchModalTableColumns(
    t,
    filesAndFoldersMetadata,
    tagAsToDelete,
    untagAsToDelete
  );

  const exportColumns = useExportTableColumns(
    t,
    filesAndFoldersMetadata,
    tagAsToDelete,
    untagAsToDelete
  );

  const exportToCsv: Awaitable<VoidFunction> = useCallback(
    async (data) => {
      const exportedColumns = exportColumns.filter(
        ({ id }) => id !== "emptyColumn"
      );

      // Get the current date and time in local timezone
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}`; // Format as yyyy-mm-dd-hh-mm

      await exportTableToCsvFile(
        data as ElementWithToDelete[],
        exportedColumns,
        {
          defaultFilePath: path.join(
            originalPath,
            `${sessionName}-search_${formattedDate}.csv`
          ),
          notificationMessage: t("search.exportNotificationMessage"),
          notificationTitle: t("search.exportNotificationTitle"),
        }
      );
    },
    [exportColumns, t, originalPath, sessionName]
  );

  const filesAndFoldersWithToDelete = useMemo(
    () =>
      Object.values(filesAndFolders).map((element) => ({
        ...element,
        toDelete: toDelete.includes(element.id),
      })),
    [filesAndFolders, toDelete]
  );

  return (
    <SearchModal
      exportToCsv={exportToCsv}
      filesAndFolders={filesAndFoldersWithToDelete}
      toDelete={toDelete}
      columns={columns}
      tags={tags}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
};
