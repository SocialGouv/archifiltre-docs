import React, { FC, ReactNode } from "react";
import Box from "@material-ui/core/Box";

type ZoomPickerOptionItemProps = {
  icon: ReactNode;
  label: string;
};

const ZoomPickerOptionItem: FC<ZoomPickerOptionItemProps> = ({
  icon,
  label,
}) => (
  <Box display="flex" justifyContent="center">
    <Box paddingRight={1}>{icon}</Box>
    {label}
  </Box>
);

export default ZoomPickerOptionItem;
