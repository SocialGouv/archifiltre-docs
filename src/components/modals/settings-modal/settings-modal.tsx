import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "hooks/use-styles";
import LanguagePicker from "../../header/dashboard/language";
import ModalHeader from "../../modals/modal-header";
import styled from "styled-components";

const LanguageContainer = styled.div`
  display: flex;
  align-items: baseline;
`;

const SettingsModal = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth="xs" fullWidth>
      <ModalHeader title={t("settingsModal.title")} onClose={closeModal} />
      <DialogContent className={classes.dialogContent} dividers>
        <LanguageContainer>
          <span>{t("settingsModal.language")}&nbsp;</span>
          <LanguagePicker />
        </LanguageContainer>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
