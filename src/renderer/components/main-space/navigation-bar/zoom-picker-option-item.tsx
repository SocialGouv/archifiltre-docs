import Box from "@mui/material/Box";
import React, { type ReactNode } from "react";

export interface ZoomPickerOptionItemProps {
  icon: ReactNode;
  label: string;
}

export const ZoomPickerOptionItem: React.FC<ZoomPickerOptionItemProps> = ({ icon, label }) => (
  <Box display="flex" justifyContent="center">
    <Box paddingRight={1}>{icon}</Box>
    {label}
  </Box>
);
