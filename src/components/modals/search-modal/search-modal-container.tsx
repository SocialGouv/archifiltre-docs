import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import { SearchModal } from "./search-modal";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { useSearchModalTableColumns } from "components/modals/search-modal/use-search-modal-table-columns";
import { useTranslation } from "react-i18next";
import { exportTableToCsvFile } from "util/table/table-util";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { useWorkspaceMetadata } from "reducers/workspace-metadata/workspace-metadata-selectors";
import path from "path";

export const SearchModalContainer = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const { sessionName, originalPath } = useWorkspaceMetadata();
  const tags = useSelector(getTagsFromStore);

  const columns = useSearchModalTableColumns(t, filesAndFoldersMetadata);

  const exportToCsv = useCallback(
    async (data: FilesAndFolders[]) => {
      const exportedColumns = columns.filter(({ id }) => id !== "emptyColumn");

      await exportTableToCsvFile(data, exportedColumns, {
        defaultFilePath: path.join(originalPath, `${sessionName}-search.csv`),
        notificationMessage: "Message",
        notificationTitle: "Title",
      });
    },
    [columns]
  );

  return (
    <SearchModal
      exportToCsv={exportToCsv}
      filesAndFolders={filesAndFolders}
      columns={columns}
      tags={tags}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
};
