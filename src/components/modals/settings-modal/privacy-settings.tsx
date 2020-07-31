import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { useUserSettings } from "hooks/use-user-settings";
import { getInitialUserSettings } from "persistent-settings";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { reloadApp } from "util/electron/electron-util";

const PrivacySettings = () => {
  const { t } = useTranslation();

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
            <Switch checked={isTrackingEnabled} onChange={toggleTracking} />
          }
          label={t("settingsModal.trackingData")}
        />
      </Box>
      <Box>
        <FormControlLabel
          control={
            <Switch checked={isMonitoringEnabled} onChange={toggleMonitoring} />
          }
          label={t("settingsModal.monitoringData")}
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

export default PrivacySettings;
