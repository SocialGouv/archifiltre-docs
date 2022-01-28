import Box from "@material-ui/core/Box";
import React from "react";
import styled from "styled-components";

import { Audit } from "../audit/audit";
import { Duplicates } from "../duplicates/duplicates";
import { EnrichmentContainer } from "../enrichment/enrichment-container";
import { General } from "../general/general";

const StyledPanel = styled.div`
  width: 100%;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
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

export interface TabsContentProps {
  tabIndex: number;
}

export const TabsContent: React.FC<TabsContentProps> = ({ tabIndex }) => (
  <Box width="100%">
    <TabPanel value={tabIndex} index={0}>
      <General />
    </TabPanel>
    <TabPanel value={tabIndex} index={1}>
      <EnrichmentContainer />
    </TabPanel>
    <TabPanel value={tabIndex} index={2}>
      <Audit />
    </TabPanel>
    <TabPanel value={tabIndex} index={3}>
      <Duplicates />
    </TabPanel>
  </Box>
);
