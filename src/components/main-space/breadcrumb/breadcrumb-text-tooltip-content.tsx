import { Box } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

const ItalicText = styled.span`
    font-style: italic;
`;

interface BreadcrumbTextTooltipContentProps {
    alias: string | null;
    name: string;
}

const BreadcrumbTextTooltipContent: React.FC<
    BreadcrumbTextTooltipContentProps
> = ({ alias, name }) =>
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
