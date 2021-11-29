import ErrorsModal from "components/modals/errors-modal/errors-modal";
import { useErrorsModalConfig } from "components/modals/errors-modal/use-errors-modal-config";
import path from "path";
import type { FC } from "react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useFilesAndFoldersErrors } from "reducers/files-and-folders/files-and-folders-selectors";
import { closeModalAction } from "reducers/modal/modal-actions";
import { useOpenModal } from "reducers/modal/modal-selectors";
import { Modal } from "reducers/modal/modal-types";
import { reloadFilesAndFoldersThunk } from "reducers/store-thunks";
import { useWorkspaceMetadata } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { exportTableToCsvFile } from "util/table/table-util";

const FilesAndFoldersErrorsModalContainer: FC = () => {
    const errors = useFilesAndFoldersErrors();
    const openModal = useOpenModal();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { originalPath } = useWorkspaceMetadata();

    const closeModal = useCallback(
        () => dispatch(closeModalAction()),
        [dispatch]
    );

    const retry = useCallback(
        () => dispatch(reloadFilesAndFoldersThunk()),
        [dispatch]
    );

    const config = useErrorsModalConfig(t);

    const exportErrors = useCallback(
        async (errors) => {
            await exportTableToCsvFile(errors, config, {
                defaultFilePath: path.join(
                    originalPath,
                    "..",
                    "load-errors.csv"
                ),
                notificationMessage: t("errorsModal.exportNotificationMessage"),
                notificationTitle: t("errorsModal.exportNotificationTitle"),
            });
        },
        [config, originalPath, t]
    );

    const isModalOpen = openModal === Modal.FIlES_AND_FOLDERS_ERRORS_MODAL;

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

export default FilesAndFoldersErrorsModalContainer;
