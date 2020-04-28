import Button from "@material-ui/core/Button";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowsAlt } from "react-icons/fa";
import { useFileMoveActiveState } from "hooks/use-file-move-active-state";

const MoveFilesButton: FC = () => {
  const { t } = useTranslation();
  const { isFileMoveActive, setFileMoveActive } = useFileMoveActiveState();
  const toggleMoveElements = useCallback(() => {
    setFileMoveActive(!isFileMoveActive);
  }, [setFileMoveActive, isFileMoveActive]);

  return (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      onClick={toggleMoveElements}
      startIcon={<FaArrowsAlt />}
    >
      {isFileMoveActive
        ? t("workspace.normalMode")
        : t("workspace.moveElementsMode")}
    </Button>
  );
};

export default MoveFilesButton;
