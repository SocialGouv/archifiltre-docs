import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

import { BreadcrumbTextTooltipContent } from "./breadcrumb-text-tooltip-content";

export interface BreadcrumbTextProps {
  alias: string | null;
  name: string;
}

export const BreadcrumbText: React.FC<BreadcrumbTextProps> = ({
  name,
  alias,
}) => (
  <Box height="100%" display="flex" maxHeight="1.25rem">
    <Tooltip title={<BreadcrumbTextTooltipContent alias={alias} name={name} />}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMinYMid meet"
      >
        <text x="0" y="75" fontSize="75" fill="black">
          {alias ? (
            <>
              <tspan>{alias} </tspan>
              <tspan fontStyle="italic">({name})</tspan>
            </>
          ) : (
            <tspan>{name}</tspan>
          )}
        </text>
      </svg>
    </Tooltip>
  </Box>
);
