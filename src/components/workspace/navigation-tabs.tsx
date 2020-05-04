import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Report from "../report/report-container";
import styled from "styled-components";
import Enrichment from "./enrichment-container";

const StyledTabs = styled(Tabs)`
  width: 100%;
`;

const StyledPanel = styled.div`
  width: 100%;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <StyledPanel
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && <Box boxSizing="border-box">{children}</Box>}
  </StyledPanel>
);

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

interface NavigationTabsProps {
  api: any;
}

const NavigationTabs: FC<NavigationTabsProps> = ({ api }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    },
    [setValue]
  );

  return (
    <>
      <StyledTabs value={value} onChange={handleChange}>
        <Tab label={t("workspace.general")} {...a11yProps(0)} />
        <Tab label={t("workspace.enrichment")} {...a11yProps(1)} />
        <Tab label={t("workspace.audit")} {...a11yProps(2)} />
        <Tab label={t("workspace.duplicates")} {...a11yProps(3)} />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <Report api={api} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Enrichment api={api} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Work in progress
      </TabPanel>
      <TabPanel value={value} index={3}>
        Work in progress
      </TabPanel>
    </>
  );
};

export default NavigationTabs;
