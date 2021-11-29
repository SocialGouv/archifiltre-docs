import type { FC } from "react";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useArchifiltreErrors } from "../../../reducers/loading-info/loading-info-selectors";
import { closeModalAction } from "../../../reducers/modal/modal-actions";
import { useOpenModal } from "../../../reducers/modal/modal-selectors";
import { Modal } from "../../../reducers/modal/modal-types";
import ErrorsModal from "./errors-modal";

const ErrorsModalContainer: FC = () => {
    const errors = useArchifiltreErrors();
    const openModal = useOpenModal();
    const dispatch = useDispatch();

    const closeModal = useCallback(
        () => dispatch(closeModalAction()),
        [dispatch]
    );

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
