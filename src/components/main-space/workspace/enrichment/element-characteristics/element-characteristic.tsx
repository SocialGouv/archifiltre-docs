import React, { FC, ReactNode } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

interface ElementCharacteristicProps {
  name: ReactNode;
  value: ReactNode;
}

const ElementCharacteristic: FC<ElementCharacteristicProps> = ({
  name,
  value,
}) => (
  <Box display="flex" whiteSpace="nowrap">
    <Box marginRight={0.5}>
      <Typography variant="h5">{name} : </Typography>
    </Box>
    <Box>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

export default ElementCharacteristic;
