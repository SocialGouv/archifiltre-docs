import type { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAreHashesReady } from "reducers/files-and-folders/files-and-folders-selectors";

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

interface TabsHeaderProps {
    setTabIndex: (tabIndex: number) => void;
    tabIndex: number;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ setTabIndex, tabIndex }) => {
    const { t } = useTranslation();
    const classes = useLocalStyles();
    const areHashesReady = useSelector(getAreHashesReady);

    const tabData = useMemo(
        () => [
            { disabled: false, label: t("workspace.general") },
            { disabled: false, label: t("workspace.enrichment") },
            { disabled: false, label: t("workspace.audit") },
            { disabled: !areHashesReady, label: t("workspace.duplicates") },
        ],
        [t, areHashesReady]
    );

    const handleTracking = (tabIndex) => {
        addTracker({
            title: ActionTitle.CLICK_ON_TAB,
            type: ActionType.TRACK_EVENT,
            value: `Click on ${t(tabData[tabIndex].label)}`,
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
