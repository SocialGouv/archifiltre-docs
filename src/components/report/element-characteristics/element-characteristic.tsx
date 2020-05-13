import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";

interface ElementCharacteristicProps {
  name: string;
  value: string;
}

const ElementCharacteristic: FC<ElementCharacteristicProps> = ({
  name,
  value,
}) => (
  <Box display="flex">
    <Box marginRight={0.5}>
      <Typography variant="h5">{name} : </Typography>
    </Box>
    <Box>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

export default ElementCharacteristic;
