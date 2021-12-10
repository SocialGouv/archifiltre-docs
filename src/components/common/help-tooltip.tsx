import Tooltip from "@material-ui/core/Tooltip";
import React, { memo } from "react";
import { FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";

const CenteredIcon = styled.span`
    vertical-align: middle;
`;

export interface HelpTooltipProps {
    tooltipText: string;
}

const _HelpTooltip: React.FC<HelpTooltipProps> = ({ tooltipText }) => (
    <Tooltip title={tooltipText}>
        <CenteredIcon>
            <FaInfoCircle />
        </CenteredIcon>
    </Tooltip>
);

_HelpTooltip.displayName = "HelpTooltip";

export const HelpTooltip = memo(_HelpTooltip);
