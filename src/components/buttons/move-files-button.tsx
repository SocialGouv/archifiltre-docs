import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowsAlt } from "react-icons/fa";
import Button, { ButtonColor, ButtonSize } from "../common/button";
import { useFileMoveActiveState } from "../../hooks/use-file-move-active-state";

export const MoveFilesButton = () => {
  const { t } = useTranslation();
  const { isFileMoveActive, setFileMoveActive } = useFileMoveActiveState();
  const toggleMoveElements = useCallback(() => {
    setFileMoveActive(!isFileMoveActive);
  }, [setFileMoveActive, isFileMoveActive]);
  return (
    <Button
      id="move-files-button"
      color={ButtonColor.ICICLE_ACTION}
      size={ButtonSize.SMALL}
      onClick={toggleMoveElements}
    >
      <FaArrowsAlt style={{ verticalAlign: "bottom" }} />
      &ensp;
      {isFileMoveActive
        ? t("workspace.normalMode")
        : t("workspace.moveElementsMode")}
    </Button>
  );
};
