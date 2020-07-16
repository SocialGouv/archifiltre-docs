import React, { FC } from "react";
import { Box } from "@material-ui/core";

type BreadcrumbTextProps = {
  name: string;
  alias: string | null;
};

const BreadcrumbText: FC<BreadcrumbTextProps> = ({ name, alias }) => (
  <Box height="100%" display="flex" maxHeight="0.875rem">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMinYMid meet"
    >
      <text x="0" y="100" fontSize="100" fill="black">
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
  </Box>
);

export default BreadcrumbText;
