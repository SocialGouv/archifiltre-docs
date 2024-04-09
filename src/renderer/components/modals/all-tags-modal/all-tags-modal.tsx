import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useStyles } from "../../../hooks/use-styles";
import { AllTagsContainer } from "../../main-space/workspace/enrichment/tags/all-tags-container";
import { ModalHeader } from "../modal-header";

const StyledPaper = styled(Paper)`
  min-height: 50%;
`;

export interface SettingsModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

export const AllTagsModal: React.FC<SettingsModalProps> = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth="xs" fullWidth PaperComponent={StyledPaper}>
      <ModalHeader title={t("workspace.allTags")} onClose={closeModal} />
      <DialogContent className={classes.allTagsDialogContent} dividers>
        <AllTagsContainer />
      </DialogContent>
    </Dialog>
  );
};
