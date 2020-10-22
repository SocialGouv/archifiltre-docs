import React, { FC, useCallback, useMemo } from "react";
import { useOpenModal } from "reducers/modal/modal-selectors";
import { useDispatch } from "react-redux";
import { closeModalAction } from "reducers/modal/modal-actions";
import { Modal } from "reducers/modal/modal-types";
import ErrorsModal from "components/modals/errors-modal/errors-modal";
import { useFilesAndFoldersErrors } from "reducers/files-and-folders/files-and-folders-selectors";
import { reloadFilesAndFoldersThunk } from "reducers/store-thunks";
import { useTranslation } from "react-i18next";
import { useErrorsModalConfig } from "components/modals/errors-modal/use-errors-modal-config";
import { exportTableToCsvFile } from "util/table/table-util";
import { useWorkspaceMetadata } from "reducers/workspace-metadata/workspace-metadata-selectors";
import path from "path";

const FilesAndFoldersErrorsModalContainer: FC = () => {
  const errors = useFilesAndFoldersErrors();
  const openModal = useOpenModal();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { originalPath } = useWorkspaceMetadata();

  const closeModal = useCallback(() => dispatch(closeModalAction()), [
    dispatch,
  ]);

  const retry = useCallback(() => dispatch(reloadFilesAndFoldersThunk()), [
    dispatch,
  ]);

  const config = useErrorsModalConfig(t);

  const exportErrors = useCallback(
    async (errors) => {
      await exportTableToCsvFile(errors, config, {
        defaultFilePath: path.join(originalPath, "..", "load-errors.csv"),
        notificationTitle: t("errorsModal.exportNotificationTitle"),
        notificationMessage: t("errorsModal.exportNotificationMessage"),
      });
    },
    [config, originalPath, t]
  );

  const isModalOpen = openModal === Modal.FIlES_AND_FOLDERS_ERRORS_MODAL;

  const actions = useMemo(
    () => [
      {
        id: "retry",
        title: t("common.retry"),
        action: retry,
      },
      {
        id: "export",
        title: t("common.exportActionTitle"),
        action: exportErrors,
      },
    ],
    [t, retry, exportErrors]
  );

  return (
    <ErrorsModal
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      errors={errors}
      actions={actions}
    />
  );
};

export default FilesAndFoldersErrorsModalContainer;
