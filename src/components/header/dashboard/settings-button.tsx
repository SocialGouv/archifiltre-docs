import React from "react";
import { FaCog } from "react-icons/fa";
import { useModal } from "../../../hooks/useModal";
import Button, { ButtonAngles, ButtonSize } from "../../common/button";
import SettingsModal from "./settings-modal";

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
