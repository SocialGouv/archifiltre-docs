import Dialog from "@mui/material/Dialog";
import { StyledEngineProvider, type Theme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";

import { theme } from "../../../theme/theme";
import { ModalHeader } from "../modal-header";
import { ExportModalContentContainer as ExportModalContent } from "./export-modal-content-container";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

export interface ExportModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
          <ModalHeader title={t("exportModal.title")} onClose={closeModal} />
          <ExportModalContent closeModal={closeModal} />
        </Dialog>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
