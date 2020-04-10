import React, { FC, MouseEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TagBadge, { TagBadgeColor } from "./tag-badge";
import Grid from "@material-ui/core/Grid";

const ButtonWrapper = styled.div`
  padding: 0.3em;
  font-weight: bold;
`;

interface MarkToDeleteButtonProps {
  isCurrentFileMarkedToDelete: boolean;
  onClick: MouseEventHandler;
}

const MarkToDeleteButton: FC<MarkToDeleteButtonProps> = ({
  isCurrentFileMarkedToDelete,
  onClick,
}) => {
  const { t } = useTranslation();
  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClick(event);
    },
    [onClick]
  );
  return (
    <ButtonWrapper>
      <Grid container>
        <TagBadge
          color={TagBadgeColor.DELETE}
          active={isCurrentFileMarkedToDelete}
          onClick={handleClick}
        >
          {t("common.toDelete")}
        </TagBadge>
      </Grid>
    </ButtonWrapper>
  );
};

export default MarkToDeleteButton;
