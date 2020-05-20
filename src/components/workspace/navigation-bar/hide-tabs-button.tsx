import Button from "@material-ui/core/Button";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useHideTabsState } from "../../../hooks/use-hide-tabs-state";

const HideTabsButton: FC = () => {
  const { t } = useTranslation();
  const { areTabsHidden, setTabsHidden } = useHideTabsState();
  const toggleHideTabs = useCallback(() => {
    setTabsHidden(!areTabsHidden);
  }, [setTabsHidden, areTabsHidden]);

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={toggleHideTabs}
      startIcon={areTabsHidden ? <FaEye /> : <FaEyeSlash />}
    >
      {areTabsHidden ? t("workspace.showTabs") : t("workspace.hideTabs")}
    </Button>
  );
};

export default HideTabsButton;
