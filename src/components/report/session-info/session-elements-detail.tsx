import React, { FC } from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import TextInfo from "../../text/text-info";

interface SessionElementsDetailProps {
  title: string;
  content: string | number;
}

const Title = styled.div`
  text-transform: uppercase;
  font-weight: bold;
`;

const Content = styled.div`
  font-weight: bold;
`;

const SessionElementsDetail: FC<SessionElementsDetailProps> = ({
  title,
  content,
}) => (
  <Box>
    <Box>
      <TextInfo uppercase={true}>{title}</TextInfo>
    </Box>
    <Box>
      <TextInfo>{content}</TextInfo>
    </Box>
  </Box>
);

export default SessionElementsDetail;
