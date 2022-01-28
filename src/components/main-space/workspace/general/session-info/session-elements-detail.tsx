import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";

export interface SessionElementsDetailProps {
  title: string;
  content: number | string;
}

export const SessionElementsDetail: React.FC<SessionElementsDetailProps> = ({
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
