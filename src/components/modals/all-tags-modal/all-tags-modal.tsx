import Paper from "@material-ui/core/Paper";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "hooks/use-styles";
import ModalHeader from "components/modals/modal-header";
import AllTagsContainer from "components/main-space/workspace/enrichment/tags/all-tags-container";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  min-height: 50%;
`;

type SettingsModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const AllTagsModal: FC<SettingsModalProps> = ({ isModalOpen, closeModal }) => {
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
