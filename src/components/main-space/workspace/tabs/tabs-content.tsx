import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import General from "components/main-space/workspace/general/general-container";
import styled from "styled-components";
import Duplicates from "components/main-space/workspace/duplicates/duplicates";
import Enrichment from "components/main-space/workspace/enrichment/enrichment-container";
import Audit from "components/main-space/workspace/audit/audit";

const StyledPanel = styled.div`
  width: 100%;
`;

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => (
  <StyledPanel
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && (
      <Box height="100%" boxSizing="border-box">
        {children}
      </Box>
    )}
  </StyledPanel>
);

type TabsContentProps = {
  tabIndex: number;
};

const TabsContent: FC<TabsContentProps> = ({ tabIndex }) => (
  <Box width="100%">
    <TabPanel value={tabIndex} index={0}>
      <General />
    </TabPanel>
    <TabPanel value={tabIndex} index={1}>
      <Enrichment />
    </TabPanel>
    <TabPanel value={tabIndex} index={2}>
      <Audit />
    </TabPanel>
    <TabPanel value={tabIndex} index={3}>
      <Duplicates />
    </TabPanel>
  </Box>
);
export default TabsContent;
