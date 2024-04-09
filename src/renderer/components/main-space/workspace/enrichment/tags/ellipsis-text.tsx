import Tooltip from "@mui/material/Tooltip";
import React from "react";
import styled from "styled-components";

interface ContainerProps {
  maxWidth: number;
}

const Container = styled.div<ContainerProps>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ maxWidth }) => maxWidth}px;
`;

export interface EllipsisTextProps {
  children: React.ReactNode;
  displayTooltip?: boolean;
  maxWidth?: number;
}

export const EllipsisText: React.FC<EllipsisTextProps> = ({ children, maxWidth = 70, displayTooltip = true }) =>
  displayTooltip ? (
    <Tooltip title={children?.toString() ?? ""}>
      <Container maxWidth={maxWidth}>{children}</Container>
    </Tooltip>
  ) : (
    <Container maxWidth={maxWidth}>{children}</Container>
  );
