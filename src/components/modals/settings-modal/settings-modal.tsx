import { Box } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import LanguagePicker from "components/header/language";
import About from "components/modals/settings-modal/about";
import ModalMenu from "components/modals/settings-modal/modal-menu";
import PrivacySettings from "components/modals/settings-modal/privacy-settings";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalHeader from "../../modals/modal-header";

const availableSettings = [<LanguagePicker />, <PrivacySettings />, <About />];

const SettingsModal = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
      <ModalHeader title={t("settingsModal.title")} onClose={closeModal} />
      <DialogContent dividers>
        <Box display="flex">
          <Box>
            <ModalMenu
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </Box>
          <Box paddingLeft={2}>{availableSettings[selectedItem]}</Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
