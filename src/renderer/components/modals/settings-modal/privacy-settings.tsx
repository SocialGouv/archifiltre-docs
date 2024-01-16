import { reloadApp } from "@common/utils/electron";
import type { Theme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetUserSettings } from "../../../hooks/use-user-settings";

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
  const { userSettings, updateUserSettings } = useGetUserSettings();
  const classes = useStyles();

  const [isTrackingEnabled, setIsTrackingEnabled] = useState<boolean>(
    userSettings.isTrackingEnabled
  );
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState<boolean>(
    userSettings.isMonitoringEnabled
  );
  const [isButtonDisable, setIsButtonDisable] = useState<boolean>(false);

  const hasSettingChanged =
    isTrackingEnabled !== userSettings.isTrackingEnabled ||
    isMonitoringEnabled !== userSettings.isMonitoringEnabled;

  const reloadExplanation = t("settingsModal.reloadExplanation");

  return (
    <Box>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={isTrackingEnabled}
              onChange={(event) => {
                setIsTrackingEnabled(event.target.checked);
              }}
            />
          }
          label={t("settingsModal.trackingData")}
          classes={{
            label: isTrackingEnabled ? classes.enabled : classes.disabled,
          }}
        />
      </Box>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={isMonitoringEnabled}
              onChange={(event) => {
                setIsMonitoringEnabled(event.target.checked);
              }}
            />
          }
          label={t("settingsModal.monitoringData")}
          classes={{
            label: isMonitoringEnabled ? classes.enabled : classes.disabled,
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
              disabled={!hasSettingChanged || isButtonDisable}
              onClick={async () => {
                setIsButtonDisable(true);
                await updateUserSettings({
                  isMonitoringEnabled,
                  isTrackingEnabled,
                });
                await reloadApp(); // TODO remove after UserSettings don't need to reload
              }}
            >
              {t("common.reload")}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
