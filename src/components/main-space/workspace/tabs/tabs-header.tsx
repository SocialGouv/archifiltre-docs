import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAreHashesReady } from "reducers/files-and-folders/files-and-folders-selectors";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    tab: {
      minWidth: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
      paddingBottom: 0,
      "&.MuiTab-textColorPrimary.Mui-selected > span": {
        fontFamily: "QuicksandBold",
      },
    },
  })
);

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

type TabsHeaderProps = {
  setTabIndex: (tabIndex: number) => void;
  tabIndex: number;
};

const TabsHeader: FC<TabsHeaderProps> = ({ setTabIndex, tabIndex }) => {
  const { t } = useTranslation();
  const classes = useLocalStyles();
  const areHashesReady = useSelector(getAreHashesReady);

  const tabData = useMemo(
    () => [
      { label: t("workspace.general"), disabled: false },
      { label: t("workspace.enrichment"), disabled: false },
      { label: t("workspace.audit"), disabled: false },
      { label: t("workspace.duplicates"), disabled: !areHashesReady },
    ],
    [t, areHashesReady]
  );

  const handleTracking = (tabIndex) => {
    addTracker({
      title: ActionTitle.CLICK_ON_TAB,
      value: `Click on ${t(tabData[tabIndex].label)}`,
      type: ActionType.TRACK_EVENT,
    });
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      handleTracking(newValue);
      setTabIndex(newValue);
    },
    [setTabIndex]
  );

  return (
    <Tabs
      value={tabIndex}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
    >
      {tabData.map(({ label, disabled }, index) => (
        <Tab
          key={`${label}- ${index}`}
          label={label}
          className={classes.tab}
          {...a11yProps(index)}
          disabled={disabled}
        />
      ))}
    </Tabs>
  );
};

export default TabsHeader;
