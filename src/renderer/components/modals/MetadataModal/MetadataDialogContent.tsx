import { DialogContent } from "@material-ui/core";
import type { FC } from "react";
import React from "react";

import { useStyles } from "../../../hooks/use-styles";

export const MetadataDialogContent: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <DialogContent className={classes.dialogContent} dividers>
      {children}
    </DialogContent>
  );
};
