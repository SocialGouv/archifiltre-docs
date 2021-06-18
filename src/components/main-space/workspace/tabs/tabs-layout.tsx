import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { FC, ReactNode } from "react";

type ComponentElement = {
  title: ReactNode;
  content: ReactNode;
  widthRatio?: number;
  isLast?: boolean;
};

export const makeTabComponent = ({
  title,
  content,
  widthRatio = 1,
  isLast,
}: ComponentElement) => {
  const Component: FC = () => (
    <React.Fragment>
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
    </React.Fragment>
  );

  return Component;
};

const TabsLayout: FC = ({ children }) => {
  return (
    <Box display="flex" height="100%">
      {children}
    </Box>
  );
};

export default TabsLayout;
