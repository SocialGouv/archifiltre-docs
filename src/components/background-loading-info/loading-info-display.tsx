import React, { FC } from "react";
import styled from "styled-components";
import { LoadingInfo } from "reducers/loading-info/loading-info-types";
import { percent } from "util/numbers/numbers-util";
import { Button, LinearProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { FaFolderOpen } from "react-icons/fa";

const getColor = ({ color }) => color;

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

type LoadingInfoProps = {
  loadingInfo: LoadingInfo & { onClickComplete?(): unknown };
  color: string;
};

const LoadingInfoDisplay: FC<LoadingInfoProps> = ({
  loadingInfo,
  color = "black",
}) => (
  <LoadingBarContainer color={color}>
    <LoadingBarName>{loadingInfo.label}</LoadingBarName>
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <RoundedLinearProgress
          color="secondary"
          variant="determinate"
          value={(loadingInfo.progress / loadingInfo.goal) * 100}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2">
          {percent(loadingInfo.progress, loadingInfo.goal)} %
        </Typography>
      </Box>
      <Button onClick={() => loadingInfo.onClickComplete?.()}>
        <FaFolderOpen />
      </Button>
    </Box>
  </LoadingBarContainer>
);

export default LoadingInfoDisplay;
