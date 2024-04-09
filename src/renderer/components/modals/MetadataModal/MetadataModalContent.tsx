import { Dialog } from "@mui/material";
import Paper from "@mui/material/Paper";
import React, { type FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ModalHeader } from "../modal-header";

interface ModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const StyledPaper = styled(Paper)`
  height: 90%;
`;

const MetadataModalContent: FC<ModalProps> = ({ isModalOpen, closeModal, children }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="lg" scroll="paper" PaperComponent={StyledPaper}>
      <ModalHeader title={t("importModal.title")} onClose={closeModal} />
      {children}
    </Dialog>
  );
};

export default MetadataModalContent;
