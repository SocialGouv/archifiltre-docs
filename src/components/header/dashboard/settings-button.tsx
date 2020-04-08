import React from "react";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";
import Button, { ButtonAngles, ButtonWidth } from "../../common/button";
import { useModal } from "../../../hooks/use-modal";
import SettingsModal from "../../modals/settings-modal/settings-modal";

const SettingsButton = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <Button
        id="settings-button"
        angles={ButtonAngles.ROUNDED}
        width={ButtonWidth.WITH_SPACES}
        onClick={openModal}
        tooltipText={t("settingsModal.title")}
      >
        <FaCog />
      </Button>
      <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default SettingsButton;
