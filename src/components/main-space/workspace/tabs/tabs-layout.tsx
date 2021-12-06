import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import type { ReactNode } from "react";
import React from "react";

interface ComponentElement {
    title: ReactNode;
    content: ReactNode;
    widthRatio?: number;
    isLast?: boolean;
}

export const makeTabComponent = ({
    title,
    content,
    widthRatio = 1,
    isLast,
}: ComponentElement): React.FC => {
    const Component: React.FC = () => (
        <>
            <Box flex={widthRatio}>
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    paddingTop={1}
                >
                    <Box>{title}</Box>
                    <Box flexGrow={1} overflow="auto">
                        {content}
                    </Box>
                </Box>
            </Box>
            {!isLast && (
                <Box padding={2}>
                    <Divider orientation="vertical" />
                </Box>
            )}
        </>
    );

    return Component;
};

export const TabsLayout: React.FC = ({ children }) => {
    return (
        <Box display="flex" height="100%">
            {children}
        </Box>
    );
};
