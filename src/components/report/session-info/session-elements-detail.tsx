import React, { FC } from "react";
import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

interface SessionElementsDetailProps {
  title: string;
  content: string | number;
}

const SessionElementsDetail: FC<SessionElementsDetailProps> = ({
  title,
  content,
}) => (
  <Box>
    <Box>
      <Typography variant="h5">{title}</Typography>
    </Box>
    <Box>
      <Typography variant="body1">{content}</Typography>
    </Box>
  </Box>
);

export default SessionElementsDetail;
