import SettingsButton from "./settings-button";
import UserButton from "./user-button";
import SettingsModal from "components/modals/settings-modal/settings-modal";
import { useModal } from "hooks/use-modal";
import React, { FC } from "react";

type OptionsButtonProps = {
  resetWorkspace: any;
  shouldDisplayReset: boolean;
};

const OptionsButton: FC<OptionsButtonProps> = ({
  resetWorkspace,
  shouldDisplayReset,
}) => {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <div>
      {shouldDisplayReset ? (
        <UserButton resetWorkspace={resetWorkspace} openModal={openModal} />
      ) : (
        <SettingsButton openModal={openModal} />
      )}
      <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default OptionsButton;
