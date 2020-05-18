import React, { FC, ReactNode } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

interface BoundaryDateProps {
  title: ReactNode;
  content: string;
}

const BoundaryDate: FC<BoundaryDateProps> = ({ title, content }) => (
  <Box display="flex" flexDirection="column">
    <Box>
      <Typography variant="h6">{title}</Typography>
    </Box>
    <Box>
      <Typography variant="body2">{content}</Typography>
    </Box>
  </Box>
);

export default BoundaryDate;
