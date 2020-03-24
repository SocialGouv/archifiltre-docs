import React, { FC } from "react";
import { toRgba } from "../../util/color-util";
import styled from "styled-components";

export const LIGHT = "area-light";
export const NORMAL = "area-normal";

const StyledRoundedArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: ${({ color }) =>
    color === LIGHT
      ? toRgba([121, 121, 121, 0.15])
      : toRgba([121, 121, 121, 0.4])};
`;

interface RoundedAreaProps {
  color?: string;
}

/**
 * An area with rounded angles to display content
 * @param children
 * @param color - The background color. Can be NORMAL or LIGHT.
 */
export const RoundedArea: FC<RoundedAreaProps> = ({
  children,
  color = NORMAL,
}) => <StyledRoundedArea color={color}>{children}</StyledRoundedArea>;
