import React from "react";
import { useTranslation } from "react-i18next";
import ModalHeader from "../../modals/modal-header";
import LanguagePicker from "./language";
import Modal from "react-modal";
import styled from "styled-components";

const LanguageContainer = styled.div`
  display: flex;
  align-items: baseline;
`;

const modalStyle = {
  content: {
    width: "40%",
    height: "20%",
    transform: "translate(80%, 160%)",
  },
};

const SettingsModal = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyle}>
      <ModalHeader title={t("settingsModal.title")} onClose={closeModal} />
      <LanguageContainer>
        <span>{t("settingsModal.language")}&nbsp;</span>
        <LanguagePicker />
      </LanguageContainer>
    </Modal>
  );
};

export default SettingsModal;
