import { shell } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { request } from "util/http-util";
import version, { versionComparator } from "../../version";
import Button, { ButtonColor } from "../common/button";
import ModalHeader from "../modals/modal-header";
import Grid from "@material-ui/core/Grid";

const modalStyle = {
  content: {
    width: "40%",
    height: "20%",
    transform: "translate(80%, 160%)",
  },
};

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

export const NewVersionChecker = () => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [lastVersion, setLastVersion] = useState(-1);
  const { t } = useTranslation();

  useEffect(() => {
    if (MODE !== "production") return;
    request({
      method: "GET",
      url: `${ARCHIFILTRE_SITE_URL}/api-version.json`,
    })
      .then((result) => {
        const previousVersion = mapToNewVersionNumbers(result.lastVersion);
        const currentVersion = version;
        if (versionComparator(currentVersion, previousVersion) === -1) {
          setIsDisplayed(true);
          setLastVersion(previousVersion);
        }
      })
      .catch((error) => {
        // tslint:disable-next-line:no-console
        console.error(error);
      });
  }, []);

  const download = useCallback(() => shell.openExternal(ARCHIFILTRE_SITE_URL), [
    shell,
  ]);

  const onClose = useCallback(() => setIsDisplayed(false), [setIsDisplayed]);

  if (!isDisplayed) return false;
  return (
    <Modal isOpen={isDisplayed} onRequestClose={onClose} style={modalStyle}>
      <ModalHeader
        title={t("header.aNewVersionIsOut", {
          version: lastVersion,
        })}
        onClose={onClose}
      />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button
            id="download-last-version"
            onClick={download}
            color={ButtonColor.SUCCESS}
          >
            {t("header.download")}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button id="cancel" onClick={onClose} color={ButtonColor.DISABLED}>
            {t("header.cancel")}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};
