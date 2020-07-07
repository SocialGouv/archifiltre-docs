import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { FC, useCallback } from "react";
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
  setAreIciclesDisplayed: (areIcicleDisplayed: boolean) => void;
  setTabIndex: (tabIndex: number) => void;
  tabIndex: number;
};

const TabsHeader: FC<TabsHeaderProps> = ({
  setAreIciclesDisplayed,
  setTabIndex,
  tabIndex,
}) => {
  const { t } = useTranslation();
  const classes = useLocalStyles();
  const areHashesReady = useSelector(getAreHashesReady);

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setTabIndex(newValue);
      newValue === 3
        ? setAreIciclesDisplayed(false)
        : setAreIciclesDisplayed(true);
    },
    [setTabIndex, setAreIciclesDisplayed]
  );

  return (
    <Tabs
      value={tabIndex}
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
    </Tabs>
  );
};

export default TabsHeader;
