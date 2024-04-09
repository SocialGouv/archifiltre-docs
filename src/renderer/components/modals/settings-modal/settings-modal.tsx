import { type VoidFunction } from "@common/utils/function";
import Box from "@mui/material/Box";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { ModalHeader } from "../modal-header";
import { About } from "./about";
import { LanguagePicker } from "./language";
import { ModalMenu } from "./modal-menu";
import { PrivacySettings } from "./privacy-settings";

const availableSettings = [
  <LanguagePicker key="availableSettings-0" />,
  <PrivacySettings key="availableSettings-1" />,
  <About key="availableSettings-2" />,
];

export interface SettingModalProps {
  closeModal: VoidFunction;
  isModalOpen: DialogProps["open"];
}

export const SettingsModal: React.FC<SettingModalProps> = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
      <ModalHeader title={t("settingsModal.title")} onClose={closeModal} />
      <DialogContent dividers>
        <Box display="flex">
          <Box>
            <ModalMenu selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          </Box>
          <Box paddingLeft={2}>{availableSettings[selectedItem]}</Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
