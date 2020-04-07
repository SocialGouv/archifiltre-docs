import React, { FC, useCallback } from "react";
import { useArchifiltreErrors } from "../../../reducers/loading-info/loading-info-selectors";
import ErrorsModal from "./errors-modal";
import { useOpenModal } from "../../../reducers/modal/modal-selectors";
import { Modal } from "../../../reducers/modal/modal-types";
import { useDispatch } from "react-redux";
import { closeModalAction } from "../../../reducers/modal/modal-actions";

const ErrorsModalContainer: FC = () => {
  const errors = useArchifiltreErrors();
  const openModal = useOpenModal();
  const dispatch = useDispatch();

  const closeModal = useCallback(() => dispatch(closeModalAction()), [
    dispatch,
  ]);

  const isModalOpen = openModal === Modal.ERROR_MODAL;

  return (
    <ErrorsModal
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      errors={errors}
    />
  );
};

export default ErrorsModalContainer;
