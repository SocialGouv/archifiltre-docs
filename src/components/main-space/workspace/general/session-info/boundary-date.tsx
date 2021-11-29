import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import type { ReactNode } from "react";
import React from "react";

interface BoundaryDateProps {
    title: ReactNode;
    content: string;
}

const BoundaryDate: React.FC<BoundaryDateProps> = ({ title, content }) => (
    <Box display="flex" flexDirection="column">
        <Box>
            <Typography variant="h6">{title}</Typography>
        </Box>
        <Box>
            <Typography variant="body2">{content}</Typography>
        </Box>
    </Box>
);

export default BoundaryDate;
