import { shell } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";

import { request } from "util/http-util";
import version, { versionComparator } from "../../version";
import Button, { ButtonAngles, ButtonColor } from "../common/button";

const Banner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: white;
`;

const Cell = styled.div`
  padding: 0.3em 0.3em;
`;

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

  const hideBanner = useCallback(() => setIsDisplayed(false), [setIsDisplayed]);

  if (!isDisplayed) return false;
  return (
    <Banner className="grid-x">
      <div className="cell auto">
        <div className="grid-x align-center align-middle">
          <Cell className="cell shrink">
            {t("header.aNewVersionIsOut", {
              version: lastVersion,
            })}
          </Cell>
          <Cell className="cell shrink">
            <Button
              id="download-last-version"
              onClick={download}
              color={ButtonColor.SUCCESS}
            >
              {t("header.download")}
            </Button>
          </Cell>
        </div>
      </div>
      <Cell className="cell shrink">
        <Button
          id="close-banner"
          color={ButtonColor.DISABLED}
          angles={ButtonAngles.CIRCLE}
          onClick={hideBanner}
        >
          <FaTimes />
        </Button>
      </Cell>
    </Banner>
  );
};
