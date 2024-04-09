import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import React, { type ReactNode } from "react";

interface ComponentElement {
  content: ReactNode;
  isLast?: boolean;
  title: ReactNode;
  widthRatio?: number;
}

export const makeTabComponent = ({ title, content, widthRatio = 1, isLast }: ComponentElement): React.FC => {
  const Component: React.FC = () => (
    <>
      <Box flex={widthRatio}>
        <Box display="flex" flexDirection="column" height="100%" paddingTop={1}>
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
