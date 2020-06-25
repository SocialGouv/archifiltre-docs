import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useStyles } from "../../hooks/use-styles";
import { getAreHashesReady } from "reducers/files-and-folders/files-and-folders-selectors";
import Report from "../report/report-container";
import styled from "styled-components";
import Duplicates from "./duplicates";
import Enrichment from "./enrichment-container";
import Audit from "./audit";

const StyledTabs = styled(Tabs)`
  width: 100%;
`;

const StyledPanel = styled.div`
  width: 100%;
  min-height: 12.5rem;
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
    {value === index && (
      <Box height="100%" boxSizing="border-box">
        {children}
      </Box>
    )}
  </StyledPanel>
);

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

interface NavigationTabsProps {
  api: any;
  setAreIcicleDisplayed: (areIcicleDisplayed: boolean) => void;
}

const NavigationTabs: FC<NavigationTabsProps> = ({
  api,
  setAreIcicleDisplayed,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const areHashesReady = useSelector(getAreHashesReady);

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      newValue === 3
        ? setAreIcicleDisplayed(false)
        : setAreIcicleDisplayed(true);
    },
    [setValue, setAreIcicleDisplayed]
  );

  return (
    <>
      <StyledTabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          label={t("workspace.general")}
          className={classes.tab}
          {...a11yProps(0)}
        />
        <Tab
          label={t("workspace.enrichment")}
          className={classes.tab}
          {...a11yProps(1)}
        />
        <Tab
          label={t("workspace.audit")}
          className={classes.tab}
          {...a11yProps(2)}
        />
        <Tab
          disabled={!areHashesReady}
          label={t("workspace.duplicates")}
          className={classes.tab}
          {...a11yProps(3)}
        />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <Report />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Enrichment api={api} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Audit />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Duplicates />
      </TabPanel>
    </>
  );
};

export default NavigationTabs;
