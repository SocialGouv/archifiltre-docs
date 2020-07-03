import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import Report from "../report/report-container";
import styled from "styled-components";
import Duplicates from "./duplicates";
import Enrichment from "./enrichment-container";
import Audit from "./audit";

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

interface TabsContentProps {
  api: any;
  tabIndex: number;
}

const TabsContent: FC<TabsContentProps> = ({ api, tabIndex }) => (
  <Box width="100%">
    <TabPanel value={tabIndex} index={0}>
      <Report />
    </TabPanel>
    <TabPanel value={tabIndex} index={1}>
      <Enrichment api={api} />
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
