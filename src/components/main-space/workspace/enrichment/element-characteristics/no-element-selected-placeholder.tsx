import Box from "@material-ui/core/Box";
import React from "react";
import { FaHandPointer } from "react-icons/fa";

export interface NoElementSelectedPlaceholderProps {
    title: string;
}

export const NoElementSelectedPlaceholder: React.FC<
    NoElementSelectedPlaceholderProps
> = ({ title }) => (
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        alignItems="center"
        padding="30px"
    >
        <FaHandPointer style={{ paddingBottom: "5px" }} />
        {title}
    </Box>
);
