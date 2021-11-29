import Dialog from "@material-ui/core/Dialog";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { theme } from "theme/theme";

import ModalHeader from "../../modals/modal-header";
import ExportModalContent from "./export-modal-content-container";

interface ExportModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
    isModalOpen,
    closeModal,
}) => {
    const { t } = useTranslation();

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={isModalOpen}
                onClose={closeModal}
                fullWidth
                maxWidth="sm"
            >
                <ModalHeader
                    title={t("exportModal.title")}
                    onClose={closeModal}
                />
                <ExportModalContent closeModal={closeModal} />
            </Dialog>
        </ThemeProvider>
    );
};

export default ExportModal;
