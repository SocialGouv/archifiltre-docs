import Box from "@mui/material/Box";
import React from "react";
import styled from "styled-components";

const ItalicText = styled.span`
  font-style: italic;
`;

export interface BreadcrumbTextTooltipContentProps {
  alias: string | null;
  name: string;
}

export const BreadcrumbTextTooltipContent: React.FC<BreadcrumbTextTooltipContentProps> = ({ alias, name }) =>
  alias ? (
    <Box>
      <span>{alias}</span>
      <ItalicText>({name})</ItalicText>
    </Box>
  ) : (
    <Box>
      <span>{name}</span>
    </Box>
  );
