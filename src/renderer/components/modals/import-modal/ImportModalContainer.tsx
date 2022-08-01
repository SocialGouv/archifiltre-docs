import { Dialog, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Paper from "@material-ui/core/Paper";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { useStyles } from "../../../hooks/use-styles";
import { importMetadataThunk } from "../../../reducers/metadata/metadata-thunk";
import { ModalHeader } from "../modal-header";
import { ImportModal } from "./ImportModal";
import { useMetadataImport } from "./ImportModalHook";

interface ImportModalContainerProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const StyledPaper = styled(Paper)`
  height: 90%;
`;

export const ImportModalContainer: React.FC<ImportModalContainerProps> = ({
  isModalOpen,
  closeModal,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  const { path, ...props } = useMetadataImport();

  const importMetadata = () => {
    dispatch(
      importMetadataThunk(path, {
        delimiter: ";",
        entityIdKey: "path",
      })
    );
    closeModal();
  };

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
        <ImportModal {...props} />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={() => {
            importMetadata();
          }}
        >
          {t("importModal.import")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
