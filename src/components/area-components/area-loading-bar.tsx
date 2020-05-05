import React, { FC } from "react";
import { RoundedArea, LIGHT } from "./rounded-area";
import { toRgba } from "util/color/color-util";
import AreaTitle from "./area-title";
import AreaMessage from "./area-message";
import styled from "styled-components";

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface ProgressBarProps {
  width: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  position: absolute;
  background-color: ${toRgba([121, 121, 121, 0.3])};
  width: 70%;
  height: 100%;
  width: ${({ width }) => `${width}%`};
`;

const ProgressBarPercent = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ProgressBarText = styled.div`
  text-align: left;
  max-width: 50%;
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  padding-left: 40px;
`;

interface AreaLoadingBarProps {
  progress: number;
}

/**
 * Component for displaying a full width loading bar
 * @param children - The loading bar title
 * @param progress - The progress percentage of the loading bar
 */
const AreaLoadingBar: FC<AreaLoadingBarProps> = ({
  children,
  progress = 0,
}) => (
  <RoundedArea color={LIGHT}>
    <ProgressBarContainer>
      <ProgressBar width={progress} />
      <ProgressBarPercent>
        <AreaMessage>{Math.round(progress)}%</AreaMessage>
      </ProgressBarPercent>
      <ProgressBarText>
        <AreaTitle>{children}</AreaTitle>
      </ProgressBarText>
    </ProgressBarContainer>
  </RoundedArea>
);

export default AreaLoadingBar;
