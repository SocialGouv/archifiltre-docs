import React, { FC, useCallback } from "react";
import { useOpenModal } from "reducers/modal/modal-selectors";
import { useDispatch } from "react-redux";
import { closeModalAction } from "reducers/modal/modal-actions";
import { Modal } from "reducers/modal/modal-types";
import ErrorsModal from "components/modals/errors-modal/errors-modal";
import HashesErrorsFooter from "components/modals/hashes-errors-modal/hashes-errors-footer";
import { useFilesAndFoldersErrors } from "reducers/files-and-folders/files-and-folders-selectors";
import { reloadFilesAndFoldersThunk } from "reducers/store-thunks";

const FilesAndFoldersErrorsModalContainer: FC = () => {
  const errors = useFilesAndFoldersErrors();
  const openModal = useOpenModal();
  const dispatch = useDispatch();

  const closeModal = useCallback(() => dispatch(closeModalAction()), [
    dispatch,
  ]);

  const retry = useCallback(() => dispatch(reloadFilesAndFoldersThunk()), [
    dispatch,
  ]);

  const isModalOpen = openModal === Modal.FIlES_AND_FOLDERS_ERRORS_MODAL;

  return (
    <ErrorsModal
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      errors={errors}
      footer={<HashesErrorsFooter retry={retry} />}
    />
  );
};

export default FilesAndFoldersErrorsModalContainer;
