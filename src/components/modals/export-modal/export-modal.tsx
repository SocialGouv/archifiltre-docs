import Dialog from "@material-ui/core/Dialog";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import ModalHeader from "../../modals/modal-header";
import ExportModalContent from "./export-modal-content-container";

type ExportModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const ExportModal: FC<ExportModalProps> = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
      <ModalHeader title={t("exportModal.title")} onClose={closeModal} />
      <ExportModalContent closeModal={closeModal} />
    </Dialog>
  );
};

export default ExportModal;
