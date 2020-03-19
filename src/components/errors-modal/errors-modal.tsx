import React, { FC } from "react";
import Modal from "react-modal";
import ModalHeader from "../modals/modal-header";
import { useTranslation } from "react-i18next";
import { ArchifiltreError } from "../../reducers/loading-info/loading-info-types";
import ErrorsTable from "./errors-table";

interface ErrorsModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  errors: ArchifiltreError[];
}

const ErrorsModal: FC<ErrorsModalProps> = ({
  isModalOpen,
  closeModal,
  errors
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalHeader title={t("errorsModal.title")} onClose={closeModal} />
      <ErrorsTable errors={errors} />
    </Modal>
  );
};

export default ErrorsModal;
