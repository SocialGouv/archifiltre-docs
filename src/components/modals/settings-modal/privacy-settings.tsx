import type { Theme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useUserSettings } from "../../../hooks/use-user-settings";
import { getInitialUserSettings } from "../../../persistence/persistent-settings";
import { reloadApp } from "../../../util/electron/electron-util";

const useStyles = makeStyles((theme: Theme) => ({
    disabled: {
        color: theme.palette.grey["500"],
    },
    enabled: {
        color: theme.palette.secondary.main,
    },
}));

export const PrivacySettings: React.FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    const {
        isTrackingEnabled: defaultIsTrackingEnabled,
        isMonitoringEnabled: defaultIsMonitoringEnabled,
    } = getInitialUserSettings();
    const {
        userSettings: { isTrackingEnabled, isMonitoringEnabled },
        setUserSettings,
    } = useUserSettings();
    const hasSettingChanged =
        defaultIsTrackingEnabled !== isTrackingEnabled ||
        defaultIsMonitoringEnabled !== isMonitoringEnabled;

    const toggleTracking = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setUserSettings({ isTrackingEnabled: event.target.checked });
        },
        [setUserSettings]
    );

    const toggleMonitoring = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setUserSettings({ isMonitoringEnabled: event.target.checked });
        },
        [setUserSettings]
    );

    const reloadExplanation = t("settingsModal.reloadExplanation");

    return (
        <Box>
            <Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isTrackingEnabled}
                            onChange={toggleTracking}
                        />
                    }
                    label={t("settingsModal.trackingData")}
                    classes={{
                        label: isTrackingEnabled
                            ? classes.enabled
                            : classes.disabled,
                    }}
                />
            </Box>
            <Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isMonitoringEnabled}
                            onChange={toggleMonitoring}
                        />
                    }
                    label={t("settingsModal.monitoringData")}
                    classes={{
                        label: isMonitoringEnabled
                            ? classes.enabled
                            : classes.disabled,
                    }}
                />
            </Box>
            <Box pt={1}>
                <Tooltip title={reloadExplanation}>
                    <span>
                        <Button
                            color="primary"
                            variant="contained"
                            disableElevation
                            disabled={!hasSettingChanged}
                            onClick={reloadApp}
                        >
                            {t("common.reload")}
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};
