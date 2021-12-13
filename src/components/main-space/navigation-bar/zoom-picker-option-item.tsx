import Box from "@material-ui/core/Box";
import type { ReactNode } from "react";
import React from "react";

export interface ZoomPickerOptionItemProps {
  icon: ReactNode;
  label: string;
}

export const ZoomPickerOptionItem: React.FC<ZoomPickerOptionItemProps> = ({
  icon,
  label,
}) => (
  <Box display="flex" justifyContent="center">
    <Box paddingRight={1}>{icon}</Box>
    {label}
  </Box>
);
