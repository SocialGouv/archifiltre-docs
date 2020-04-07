import React from "react";
import { FaCog } from "react-icons/fa";
import { useModal } from "../../../hooks/use-modal";
import Button, { ButtonAngles } from "../../common/button";
import SettingsModal from "../../modals/settings-modal/settings-modal";

const SettingsButton = () => {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        id="settings-button"
        angles={ButtonAngles.ROUNDED}
        onClick={openModal}
      >
        <FaCog />
      </Button>
      <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default SettingsButton;
