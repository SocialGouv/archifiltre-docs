import React, { FC } from "react";
import styled from "styled-components";
import { LoadingInfo } from "../../reducers/loading-info/loading-info-types";
import { percent } from "../../util/numbers-util";

const getColor = ({ color }) => color;

const LoadingBarContainer = styled.div`
  color: ${getColor};
  padding-top: 10px;
  padding-bottom: 10px;
`;

const LoadingBar = styled.div`
  width: 285px;
  height: 6px;
  border: 0.5px solid green;
  border-radius: 3px;
`;

const InnerLoadingBar = styled.div`
  height: 6px;
  background-color: ${getColor};
  border-radius: 3px;
  ${({ loadingPercent }) => `width: ${loadingPercent}%`}
`;

const LoadingBarName = styled.h3`
  text-align: right;
  font-size: 10px;
  line-height: 13px;
`;

interface LoadingInfoProps {
  loadingInfo: LoadingInfo;
  color: string;
}

const LoadingInfoDisplay: FC<LoadingInfoProps> = ({
  loadingInfo,
  color = "black",
}) => (
  <LoadingBarContainer color={color}>
    <LoadingBarName>{loadingInfo.label}</LoadingBarName>
    <LoadingBarName>
      {percent(loadingInfo.progress, loadingInfo.goal)} %
    </LoadingBarName>
    <LoadingBar>
      <InnerLoadingBar
        color={color}
        loadingPercent={(loadingInfo.progress / loadingInfo.goal) * 100}
      />
    </LoadingBar>
  </LoadingBarContainer>
);

export default LoadingInfoDisplay;
