import { ipcRenderer } from "@common/ipc";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useStyles } from "../../../hooks/use-styles";
import { ModalHeader } from "../modal-header";

const StyledPaper = styled(Paper)`
  height: 90%;
`;

export interface ImportModalProps {
  closeModal: () => void;
  importMetadata: (path: string) => void;
  isModalOpen: boolean;
}

const importModalValidExtensions = ["csv"];

export const ImportModal: React.FC<ImportModalProps> = ({
  isModalOpen,
  closeModal,
  importMetadata,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [path, setPath] = useState("");

  const onFilePickerButtonClick = async () => {
    const chosenPath = await ipcRenderer.invoke("dialog.showOpenDialog", {
      filters: [
        {
          extensions: importModalValidExtensions,
          name: t("importModal.metadataFile"),
        },
      ],
      properties: ["openFile"],
    });
    if (chosenPath.filePaths.length > 0) {
      setPath(chosenPath.filePaths[0]);
    }
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
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <Box>{path}</Box>
            <Button onClick={onFilePickerButtonClick}>
              {t("importModal.pickAFile")}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={() => {
            importMetadata(path);
          }}
        >
          {t("importModal.import")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
