import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import { SearchModal } from "./search-modal";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { useSearchModalTableColumns } from "components/modals/search-modal/use-search-modal-table-columns";
import { useTranslation } from "react-i18next";
import { exportTableToCsvFile } from "util/table/table-util";
import { ElementWithToDelete } from "reducers/files-and-folders/files-and-folders-types";
import { useWorkspaceMetadata } from "reducers/workspace-metadata/workspace-metadata-selectors";
import path from "path";
import {
  markAsToDelete,
  unmarkAsToDelete,
} from "reducers/files-and-folders/files-and-folders-actions";

export const SearchModalContainer = ({ isModalOpen, closeModal }) => {
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

  const exportToCsv = useCallback(
    async (data: ElementWithToDelete[]) => {
      const exportedColumns = columns.filter(({ id }) => id !== "emptyColumn");

      await exportTableToCsvFile(data, exportedColumns, {
        defaultFilePath: path.join(originalPath, `${sessionName}-search.csv`),
        notificationMessage: t("search.exportNotificationMessage"),
        notificationTitle: t("search.exportNotificationTitle"),
      });
    },
    [columns, t]
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
      columns={columns}
      tags={tags}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
};
