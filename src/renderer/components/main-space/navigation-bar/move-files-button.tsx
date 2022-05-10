import { getTrackerProvider } from "@common/modules/tracker";
import Button from "@material-ui/core/Button";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowsAlt } from "react-icons/fa";
import styled from "styled-components";

import { useFileMoveActiveState } from "../workspace/file-move-provider";

const BetaText = styled.span`
  font-size: 0.5rem !important;
`;

export const MoveFilesButton: React.FC = () => {
  const { t } = useTranslation();
  const { isFileMoveActive, setIsFileMoveActive } = useFileMoveActiveState();
  const toggleMoveElements = useCallback(() => {
    const enabled = !isFileMoveActive;
    setIsFileMoveActive(enabled);
    getTrackerProvider().track("Feat(2.0) Move Mode Toggled", { enabled });
  }, [setIsFileMoveActive, isFileMoveActive]);

  return (
    <Button
      variant={isFileMoveActive ? "contained" : "outlined"}
      disableElevation={true}
      color="secondary"
      size="small"
      onClick={toggleMoveElements}
      startIcon={<FaArrowsAlt />}
      endIcon={<BetaText>BETA</BetaText>}
    >
      {t("workspace.moveElementsMode")}
    </Button>
  );
};
