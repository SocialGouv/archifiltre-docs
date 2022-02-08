import { Box } from "@material-ui/core";
import type { DialogProps } from "@material-ui/core/Dialog";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import type { VoidFunction } from "../../../util/function/function-util";
import { LanguagePicker } from "../../header/language";
import { ModalHeader } from "../../modals/modal-header";
import { About } from "./about";
import { ModalMenu } from "./modal-menu";
import { PrivacySettings } from "./privacy-settings";

const availableSettings = [
  <LanguagePicker key="availableSettings-0" />,
  <PrivacySettings key="availableSettings-1" />,
  <About key="availableSettings-2" />,
];

export interface SettingModalProps {
  isModalOpen: DialogProps["open"];
  closeModal: VoidFunction;
}

export const SettingsModal: React.FC<SettingModalProps> = ({
  isModalOpen,
  closeModal,
}) => {
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
