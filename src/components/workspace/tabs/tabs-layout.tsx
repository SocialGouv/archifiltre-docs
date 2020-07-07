import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CategoryTitle from "components/common/category-title";
import React, { FC, ReactNode } from "react";

type ComponentElement = {
  title: string;
  content: ReactNode;
};

type TabsLayoutProps = {
  components: ComponentElement[];
};

const TabsLayout: FC<TabsLayoutProps> = ({ components }) => {
  return (
    <Box display="flex" height="100%">
      {components.map(({ title, content }, index) => (
        <React.Fragment key={`tab-content-${index}`}>
          <Box flex={1}>
            <Box display="flex" flexDirection="column" height="100%">
              <Box>
                <CategoryTitle>{title}</CategoryTitle>
              </Box>
              <Box flexGrow={1}>{content}</Box>
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
