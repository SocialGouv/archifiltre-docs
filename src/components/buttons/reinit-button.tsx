import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import Button, { ButtonColor, ButtonWidth } from "../common/button";

export type ResetWorkspace = () => void;

interface ReinitButtonProps {
  resetWorkspace: ResetWorkspace;
}

const ReinitButton: FC<ReinitButtonProps> = ({ resetWorkspace }) => {
  const { t } = useTranslation();

  return (
    <Button
      id="reset-workspace-button"
      onClick={resetWorkspace}
      width={ButtonWidth.WITH_SPACES}
      color={ButtonColor.ERROR}
      tooltipText={t("header.close")}
    >
      <FaSignOutAlt />
    </Button>
  );
};

export default ReinitButton;
