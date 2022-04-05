import type { SimpleObject } from "@common/utils/object";
import type { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { addTracker } from "../../../../logging/tracker";
import { ActionTitle, ActionType } from "../../../../logging/tracker-types";
import { getAreHashesReady } from "../../../../reducers/files-and-folders/files-and-folders-selectors";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    tab: {
      "&.MuiTab-textColorPrimary.Mui-selected > span": {
        fontFamily: "QuicksandBold",
      },
      minWidth: 0,
      paddingBottom: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
  })
);

const a11yProps = (index: number) => ({
  "aria-controls": `tabpanel-${index}`,
  id: `tab-${index}`,
});

export interface TabsHeaderProps {
  setTabIndex: (tabIndex: number) => void;
  tabIndex: number;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  setTabIndex,
  tabIndex,
}) => {
  const { t } = useTranslation();
  const classes = useLocalStyles();
  const areHashesReady = useSelector(getAreHashesReady);

  const tabData = useMemo(
    () => [
      { disabled: false, label: t("workspace.general"), testId: "tab-general" },
      {
        disabled: false,
        label: t("workspace.enrichment"),
        testId: "tab-enrichment",
      },
      { disabled: false, label: t("workspace.audit"), testId: "tab-audit" },
      {
        disabled: !areHashesReady,
        label: t("workspace.duplicates"),
        testId: "tab-duplicates",
      },
    ],
    [t, areHashesReady]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<SimpleObject>, newValue: number) => {
      const handleTracking = (trackingTabIndex: number) => {
        addTracker({
          title: ActionTitle.CLICK_ON_TAB,
          type: ActionType.TRACK_EVENT,
          value: `Click on ${t(tabData[trackingTabIndex].label)}`,
        });
      };
      handleTracking(newValue);
      setTabIndex(newValue);
    },
    [setTabIndex, t, tabData]
  );

  return (
    <Tabs
      value={tabIndex}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
    >
      {tabData.map(({ label, disabled, testId }, index) => (
        <Tab
          key={`${label}-${index}`}
          data-test-id={testId}
          label={label}
          className={classes.tab}
          {...a11yProps(index)}
          disabled={disabled}
        />
      ))}
    </Tabs>
  );
};
