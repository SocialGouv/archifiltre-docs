import { Tooltip } from "@material-ui/core";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";

const CenteredIcon = styled.span`
  vertical-align: middle;
`;

const HelpTooltip = ({ tooltipText }) => (
  <Tooltip title={tooltipText}>
    <CenteredIcon>
      <FaInfoCircle />
    </CenteredIcon>
  </Tooltip>
);

export default React.memo(HelpTooltip);
