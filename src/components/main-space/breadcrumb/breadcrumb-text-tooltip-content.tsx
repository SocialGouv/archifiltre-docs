import { FC } from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import React from "react";

const ItalicText = styled.span`
  font-style: italic;
`;

type BreadcrumbTextTooltipContentProps = {
  alias: string | null;
  name: string;
};

const BreadcrumbTextTooltipContent: FC<BreadcrumbTextTooltipContentProps> = ({
  alias,
  name,
}) =>
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

export default BreadcrumbTextTooltipContent;
