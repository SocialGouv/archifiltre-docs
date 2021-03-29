import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { request } from "util/http-util";
import { useStyles } from "hooks/use-styles";
import { reportError } from "logging/reporter";
import version, { versionComparator } from "../../version";
import ModalHeader from "../modals/modal-header";
import { openLink } from "util/electron/electron-util";

/**
 * Maps a version number to this format: MAJOR.MINOR.PATCH
 * @param lastVersion number to map
 * @returns {string|*}
 */
export const mapToNewVersionNumbers = (lastVersion) => {
  if (lastVersion.split(".").length === 1) {
    return `1.${lastVersion}.0`;
  }
  if (lastVersion.split(".").length === 2) {
    return `1.${lastVersion}`;
  }
  return lastVersion;
};

export const NewVersionChecker: FC = () => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [lastVersion, setLastVersion] = useState(-1);
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    request({
      method: "GET",
      url: `${ARCHIFILTRE_SITE_URL}/api-version.json`,
    })
      .then((result) => {
        const previousVersion = mapToNewVersionNumbers(
          JSON.parse(result).lastVersion
        );
        const currentVersion = version;
        if (versionComparator(currentVersion, previousVersion) === -1) {
          setIsDisplayed(true);
          setLastVersion(previousVersion);
        }
      })
      .catch((error) => {
        reportError(error);
      });
  }, []);

  const download = useCallback(() => openLink(ARCHIFILTRE_SITE_URL), []);

  const onClose = useCallback(() => setIsDisplayed(false), [setIsDisplayed]);

  if (!isDisplayed) return null;
  return (
    <Dialog open={isDisplayed} onClose={onClose}>
      <ModalHeader title={t("header.newVersion")} onClose={onClose} />
      <DialogContent className={classes.dialogContent}>
        {t("header.aNewVersionIsOut", {
          version: lastVersion,
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={download} color="primary">
          {t("header.download")}
        </Button>
        <Button onClick={onClose} color="primary">
          {t("header.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
