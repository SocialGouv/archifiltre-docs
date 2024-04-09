import { getPercentage } from "@common/utils/numbers";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React from "react";
import styled from "styled-components";

import { type LoadingInfo } from "../../reducers/loading-info/loading-info-types";

const getColor = ({ color }: { color: string }) => color;

const LoadingBarContainer = styled.div`
  color: ${getColor};
  padding-top: 10px;
  padding-bottom: 10px;
`;

const LoadingBarName = styled.h3`
  font-size: 10px;
  line-height: 13px;
`;

const RoundedLinearProgress = styled(LinearProgress)`
  border-radius: 5px;
`;

export interface LoadingInfoProps {
  color: string;
  isLoaded: boolean;
  label: string;
  loadingInfo: LoadingInfo;
}

export const LoadingInfoDisplay: React.FC<LoadingInfoProps> = ({ loadingInfo, color = "black", label }) => (
  <LoadingBarContainer color={color}>
    <LoadingBarName>{label || loadingInfo.label}</LoadingBarName>
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <RoundedLinearProgress
          color="secondary"
          variant="determinate"
          value={(loadingInfo.progress / loadingInfo.goal) * 100}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2">{getPercentage(loadingInfo.progress, loadingInfo.goal)} %</Typography>
      </Box>
    </Box>
  </LoadingBarContainer>
);
