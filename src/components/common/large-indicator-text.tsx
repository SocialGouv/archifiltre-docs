import Typography from "@material-ui/core/Typography";
import type { FC } from "react";
import React from "react";

import { useStyles } from "../../hooks/use-styles";

export const LargeIndicatorText: FC = ({ children }) => {
    const { largeIndicatorText } = useStyles();

    return (
        <Typography variant="body1" className={largeIndicatorText}>
            {children}
        </Typography>
    );
};
