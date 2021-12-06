import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import type { ReactNode } from "react";
import React from "react";

export interface ElementCharacteristicProps {
    name: ReactNode;
    value: ReactNode;
}

export const ElementCharacteristic: React.FC<ElementCharacteristicProps> = ({
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
