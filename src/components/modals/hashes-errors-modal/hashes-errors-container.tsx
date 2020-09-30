import React, { FC, useCallback } from "react";
import { useOpenModal } from "reducers/modal/modal-selectors";
import { useDispatch } from "react-redux";
import { closeModalAction } from "reducers/modal/modal-actions";
import { Modal } from "reducers/modal/modal-types";
import ErrorsModal from "components/modals/errors-modal/errors-modal";
import { useHashesErrors } from "reducers/hashes/hashes-selectors";
import HashesErrorsFooter from "components/modals/hashes-errors-modal/hashes-errors-footer";
import { retryHashesComputingThunk } from "hash-computer/hash-computer-thunk";

const HashesErrorsModalContainer: FC = () => {
  const errors = useHashesErrors();
  const openModal = useOpenModal();
  const dispatch = useDispatch();

  const closeModal = useCallback(() => dispatch(closeModalAction()), [
    dispatch,
  ]);

  const retry = useCallback(() => dispatch(retryHashesComputingThunk()), [
    dispatch,
  ]);

  const isModalOpen = openModal === Modal.HASHES_ERROR_MODAL;

  return (
    <ErrorsModal
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      errors={errors}
      footer={<HashesErrorsFooter retry={retry} />}
    />
  );
};

export default HashesErrorsModalContainer;
