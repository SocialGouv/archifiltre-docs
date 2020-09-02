import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { FC, ReactNode } from "react";

type ComponentElement = {
  title: ReactNode;
  content: ReactNode;
  widthRatio?: number;
};

type TabsLayoutProps = {
  components: ComponentElement[];
};

const TabsLayout: FC<TabsLayoutProps> = ({ components }) => {
  return (
    <Box display="flex" height="100%">
      {components.map(({ title, content, widthRatio = 1 }, index) => (
        <React.Fragment key={`tab-content-${index}`}>
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
          {components.length - 1 !== index && (
            <Box padding={2}>
              <Divider orientation="vertical" />
            </Box>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default TabsLayout;
