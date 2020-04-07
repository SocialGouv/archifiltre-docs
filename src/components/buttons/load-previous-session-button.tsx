import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaSyncAlt } from "react-icons/fa";
import styled from "styled-components";
import Button from "../common/button";

interface LoadPreviousSessionButtonProps {
  reloadPreviousSession: () => void;
}

const ButtonWrapper = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  min-width: 3em;
`;

const LoadPreviousSessionButton: FC<LoadPreviousSessionButtonProps> = ({
  reloadPreviousSession,
}) => {
  const { t } = useTranslation();
  return (
    <ButtonWrapper>
      <Button
        id="loadPreviousSession"
        onClick={reloadPreviousSession}
        tooltipText={t("header.loadPreviousSessionButtonLabel")}
      >
        <FaSyncAlt />
      </Button>
    </ButtonWrapper>
  );
};

export default LoadPreviousSessionButton;
