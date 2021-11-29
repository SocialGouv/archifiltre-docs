import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import AllTagsContainer from "components/main-space/workspace/enrichment/tags/all-tags-container";
import ModalHeader from "components/modals/modal-header";
import { useStyles } from "hooks/use-styles";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
    min-height: 50%;
`;

interface SettingsModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
}

const AllTagsModal: React.FC<SettingsModalProps> = ({
    isModalOpen,
    closeModal,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Dialog
            open={isModalOpen}
            onClose={closeModal}
            maxWidth="xs"
            fullWidth
            PaperComponent={StyledPaper}
        >
            <ModalHeader title={t("workspace.allTags")} onClose={closeModal} />
            <DialogContent className={classes.allTagsDialogContent} dividers>
                <AllTagsContainer />
            </DialogContent>
        </Dialog>
    );
};

export default AllTagsModal;
