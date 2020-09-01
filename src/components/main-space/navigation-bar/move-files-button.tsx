import Button from "@material-ui/core/Button";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowsAlt, FaHandPointer } from "react-icons/fa";
import { useFileMoveActiveState } from "hooks/use-file-move-active-state";
import styled from "styled-components";

const BetaText = styled.span`
  font-size: 0.5rem !important;
`;

const MoveFilesButton: FC = () => {
  const { t } = useTranslation();
  const { isFileMoveActive, setFileMoveActive } = useFileMoveActiveState();
  const toggleMoveElements = useCallback(() => {
    setFileMoveActive(!isFileMoveActive);
  }, [setFileMoveActive, isFileMoveActive]);

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={toggleMoveElements}
      startIcon={isFileMoveActive ? <FaHandPointer /> : <FaArrowsAlt />}
      endIcon={<BetaText>BETA</BetaText>}
    >
      {isFileMoveActive
        ? t("workspace.normalMode")
        : t("workspace.moveElementsMode")}
    </Button>
  );
};

export default MoveFilesButton;
