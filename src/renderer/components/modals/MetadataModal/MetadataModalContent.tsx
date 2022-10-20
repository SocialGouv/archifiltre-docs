import { Dialog, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Paper from "@material-ui/core/Paper";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useStyles } from "../../../hooks/use-styles";
import { ModalHeader } from "../modal-header";
import type { SimpleMetadataEvents } from "./MetadataModalStateMachine";
import type { ModalAction } from "./MetadataModalTypes";

interface ModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

interface MetadataModalContentProps extends ModalProps {
  actions: ModalAction[];
  onAction: (actionId: SimpleMetadataEvents["type"]) => void;
}

const StyledPaper = styled(Paper)`
  height: 90%;
`;

const MetadataModalContent: FC<MetadataModalContentProps> = ({
  isModalOpen,
  closeModal,
  children,
  actions,
  onAction,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperComponent={StyledPaper}
    >
      <ModalHeader title={t("importModal.title")} onClose={closeModal} />
      <DialogContent className={classes.dialogContent} dividers>
        {children}
      </DialogContent>
      <DialogActions>
        {actions.map(({ id, label }) => (
          <Button
            key={`action-${id}`}
            color="primary"
            variant="contained"
            disableElevation
            onClick={() => {
              onAction(id);
            }}
          >
            {t(label)}
          </Button>
        ))}
        <Button
          color="secondary"
          variant="contained"
          disableElevation
          onClick={closeModal}
        >
          {t("importModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetadataModalContent;
