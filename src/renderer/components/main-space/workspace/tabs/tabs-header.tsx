import { getTrackerProvider } from "@common/modules/tracker";
import type { SimpleObject } from "@common/utils/object";
import createStyles from "@material-ui/core/styles/createStyles";
import type { Theme } from "@material-ui/core/styles/createTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  getAreHashesReady,
  getFilesAndFoldersFromStore,
} from "../../../../reducers/files-and-folders/files-and-folders-selectors";
import { getHashesFromStore } from "../../../../reducers/hashes/hashes-selectors";
import {
  countDuplicateFiles,
  countDuplicateFilesTotalSize,
} from "../../../../utils/duplicates";

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
    (_: React.ChangeEvent<SimpleObject>, newValue: number) => {
      setTabIndex(newValue);
    },
    [setTabIndex]
  );

  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const hashesMap = useSelector(getHashesFromStore);

  // Use the utility functions to calculate duplicates data
  const duplicateSizeRaw = useMemo(
    () => countDuplicateFilesTotalSize(filesAndFoldersMap, hashesMap),
    [filesAndFoldersMap, hashesMap]
  );

  const duplicateCount = useMemo(
    () => countDuplicateFiles(filesAndFoldersMap, hashesMap),
    [filesAndFoldersMap, hashesMap]
  );

  // Use useEffect to trigger the function when areHashesReady becomes true
  useEffect(() => {
    if (areHashesReady) {
      getTrackerProvider().track("Hash Completed", {
        duplicateCount,
        duplicateSizeRaw,
      });
    }
  }, [areHashesReady, duplicateSizeRaw, duplicateCount]);

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
