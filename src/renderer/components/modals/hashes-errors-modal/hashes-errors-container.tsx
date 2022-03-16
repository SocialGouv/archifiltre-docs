import path from "path";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { retryHashesComputingThunk } from "../../../hash-computer/hash-computer-thunk";
import { useHashesErrors } from "../../../reducers/hashes/hashes-selectors";
import { closeModalAction } from "../../../reducers/modal/modal-actions";
import { useOpenModal } from "../../../reducers/modal/modal-selectors";
import { Modal } from "../../../reducers/modal/modal-types";
import { useWorkspaceMetadata } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { exportTableToCsvFile } from "../../../utils/table";
import type { ErrorsModalProps } from "../errors-modal/errors-modal";
import { ErrorsModal } from "../errors-modal/errors-modal";
import { useErrorsModalConfig } from "../errors-modal/use-errors-modal-config";

export const HashesErrorsModalContainer: React.FC = () => {
  const errors = useHashesErrors();
  const openModal = useOpenModal();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { originalPath } = useWorkspaceMetadata();

  const closeModal = useCallback(
    () => dispatch(closeModalAction()),
    [dispatch]
  );

  const retry = useCallback(
    () => dispatch(retryHashesComputingThunk()),
    [dispatch]
  );

  const isModalOpen = openModal === Modal.HASHES_ERROR_MODAL;

  const config = useErrorsModalConfig(t);

  type ErrorModaleAction = NonNullable<
    ErrorsModalProps["actions"]
  >[number]["action"];
  const exportErrors: ErrorModaleAction = useCallback(
    async (errorsToExport) => {
      await exportTableToCsvFile(errorsToExport, config, {
        defaultFilePath: path.join(originalPath, "..", "load-errors.csv"),
        notificationMessage: t("errorsModal.exportNotificationMessage"),
        notificationTitle: t("errorsModal.exportNotificationTitle"),
      });
    },
    [config, originalPath, t]
  );

  const actions = useMemo(
    () => [
      {
        action: retry,
        id: "retry",
        title: t("common.retry"),
      },
      {
        action: exportErrors,
        id: "export",
        title: t("common.exportActionTitle"),
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
