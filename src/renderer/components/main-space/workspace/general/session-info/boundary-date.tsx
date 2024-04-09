import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { type ReactNode } from "react";

export interface BoundaryDateProps {
  content: string;
  title: ReactNode;
}

export const BoundaryDate: React.FC<BoundaryDateProps> = ({ title, content }) => (
  <Box display="flex" flexDirection="column">
    <Box>
      <Typography variant="h6">{title}</Typography>
    </Box>
    <Box>
      <Typography variant="body2">{content}</Typography>
    </Box>
  </Box>
);
