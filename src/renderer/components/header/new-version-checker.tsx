import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import type { UseAutoUpdateParam } from "../../hooks/use-auto-update";
import { useAutoUpdate } from "../../hooks/use-auto-update";
import { useStyles } from "../../hooks/use-styles";
import { reportError } from "../../logging/reporter";
import { ModalHeader } from "../modals/modal-header";

/**
 * Maps a version number to this format: MAJOR.MINOR.PATCH
 * @param lastVersion number to map
 * @returns {string|*}
 */
export const mapToNewVersionNumbers = (lastVersion: string): string => {
  if (lastVersion.split(".").length === 1) {
    return `1.${lastVersion}.0`;
  }
  if (lastVersion.split(".").length === 2) {
    return `1.${lastVersion}`;
  }
  return lastVersion;
};

export const NewVersionChecker: React.FC = () => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [lastVersion, setLastVersion] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { t } = useTranslation();
  const classes = useStyles();

  const onUpdateAvailable = useCallback<
    UseAutoUpdateParam["onUpdateAvailable"]
  >((info) => {
    if (info) {
      setIsDisplayed(true);
      setLastVersion(info.version);
    }
  }, []);
  const onUpdateError = useCallback<UseAutoUpdateParam["onUpdateError"]>(
    (error) => {
      reportError(error);
    },
    []
  );

  const { doUpdate } = useAutoUpdate({
    onUpdateAvailable,
    onUpdateError,
  });

  const download = useCallback(() => {
    const updated = doUpdate();
    if (!updated) {
      setErrorMessage("No update available."); //TODO: i18n
    }
  }, [doUpdate]);

  const onClose = useCallback(() => {
    setIsDisplayed(false);
  }, [setIsDisplayed]);

  if (!isDisplayed) return null;
  return (
    <Dialog open={isDisplayed} onClose={onClose}>
      <ModalHeader title={t("header.newVersion")} onClose={onClose} />
      <DialogContent className={classes.dialogContent}>
        {errorMessage ??
          t("header.aNewVersionIsOut", {
            version: lastVersion,
          })}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={download}
          color="primary"
          disabled={!!lastVersion || !!errorMessage}
        >
          {t("header.download")}
        </Button>
        <Button onClick={onClose} color="primary">
          {t("header.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
