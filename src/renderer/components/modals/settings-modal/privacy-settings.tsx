import { reloadApp } from "@common/utils/electron";
import { type Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import makeStyles from "@mui/styles/makeStyles";
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

  const [isTrackingEnabled, setIsTrackingEnabled] = useState<boolean>(userSettings.isTrackingEnabled);
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState<boolean>(userSettings.isMonitoringEnabled);
  const [isButtonDisable, setIsButtonDisable] = useState<boolean>(false);

  const hasSettingChanged =
    isTrackingEnabled !== userSettings.isTrackingEnabled || isMonitoringEnabled !== userSettings.isMonitoringEnabled;

  const reloadExplanation = t("settingsModal.reloadExplanation");

  return (
    <Box>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={isTrackingEnabled}
              onChange={event => {
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
              onChange={event => {
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
