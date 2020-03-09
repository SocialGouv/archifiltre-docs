import React from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/all";
import Modal from "react-modal";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  cursor: pointer;
`;

export const SearchModal = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <HeaderWrapper>
        <h4>{t("search.title")}</h4>
        <CloseButton onClick={closeModal}>
          <FaTimes />
        </CloseButton>
      </HeaderWrapper>
    </Modal>
  );
};
