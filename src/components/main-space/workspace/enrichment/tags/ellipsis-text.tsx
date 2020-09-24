import Tooltip from "@material-ui/core/Tooltip";
import React, { FC } from "react";
import styled from "styled-components";

type ContainerProps = {
  maxWidth: number;
};

const Container = styled.div<ContainerProps>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ maxWidth }) => maxWidth}px;
`;

type EllipsisTextProps = {
  maxWidth?: number;
  displayTooltip?: boolean;
};

const EllipsisText: FC<EllipsisTextProps> = ({
  children,
  maxWidth = 70,
  displayTooltip = true,
}) =>
  displayTooltip ? (
    <Tooltip title={children?.toString() || ""}>
      <Container maxWidth={maxWidth}>{children}</Container>
    </Tooltip>
  ) : (
    <Container maxWidth={maxWidth}>{children}</Container>
  );

export default EllipsisText;
