import Typography from "@material-ui/core/Typography";
import React from "react";

import { useStyles } from "../../hooks/use-styles";

export const LargeIndicatorText: React.FC = ({ children }) => {
  const { largeIndicatorText } = useStyles();

  return (
    <Typography variant="body1" className={largeIndicatorText}>
      {children}
    </Typography>
  );
};
