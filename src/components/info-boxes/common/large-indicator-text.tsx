import { useStyles } from "../../../hooks/use-styles";
import React, { FC } from "react";
import Typography from "@material-ui/core/Typography";

const LargeIndicatorText: FC = ({ children }) => {
  const { largeIndicatorText } = useStyles();

  return (
    <Typography variant="body1" className={largeIndicatorText}>
      {children}
    </Typography>
  );
};

export default LargeIndicatorText;
