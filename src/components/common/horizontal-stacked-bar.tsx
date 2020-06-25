import React, { FC, useMemo } from "react";
import Box, { BoxProps } from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import styled from "styled-components";

type HorizontalStackedBarData = {
  [key: string]: number;
};

export type HorizontalStackedBarOption = {
  key: string;
  color: string;
};

export type RenderTooltipContent = (key: string) => JSX.Element;

type HorizontalStackedBarProps = {
  data: HorizontalStackedBarData;
  bars: HorizontalStackedBarOption[];
  renderTooltipContent?: RenderTooltipContent;
};

type BarProps = {
  color: string;
  widthratio: number;
};

/**
 * We cannot use Material-ui "styled" method here as it does not forward a ref, which is mandatory
 * to display tooltips. As styled-components creates a ref, we will use it instead.
 * Manually creating a Box component is also out of question because it does not have types for ref
 * (even if the ref works with type checking disabled).
 */
const Bar = styled(Box)<BoxProps & BarProps>`
  background-color: ${({ color }) => color};
  width: ${({ widthratio }) => `${widthratio}%`};
  height: 80px;
`;

const HorizontalStackedBar: FC<HorizontalStackedBarProps> = ({
  data,
  bars,
  renderTooltipContent = () => "",
}) => {
  const total = useMemo(
    () => Object.values(data).reduce((sum, value) => sum + value, 0),
    [data]
  );
  return (
    <Box display="flex" flexWrap="nowrap" width="100%">
      {bars.map(({ key, color }) => (
        <Tooltip key={key} title={renderTooltipContent(key)}>
          <Bar color={color} widthratio={(data[key] / total) * 100} />
        </Tooltip>
      ))}
    </Box>
  );
};

export default HorizontalStackedBar;
