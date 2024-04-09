import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

export interface SessionElementsDetailProps {
  content: number | string;
  title: string;
}

export const SessionElementsDetail: React.FC<SessionElementsDetailProps> = ({ title, content }) => (
  <Box>
    <Box>
      <Typography variant="h5">{title}</Typography>
    </Box>
    <Box>
      <Typography variant="body1">{content}</Typography>
    </Box>
  </Box>
);
