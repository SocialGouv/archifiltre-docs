import React from "react";

import { request } from "util/http-util";

import * as Color from "util/color-util";

import { withTranslation } from "react-i18next";
import version, { versionComparator } from "../../version.ts";
import Button, { ButtonColor } from "../common/button";
import { mkRB } from "../buttons/button";

const { shell } = require("electron");

const bannerStyle = {
  backgroundColor: Color.folder(),
  border: "0.1em black solid"
};

const cellStyle = {
  padding: "0.3em 0.3em"
};

/**
 * Maps a version number to this format: MAJOR.MINOR.PATCH
 * @param version number to map
 * @returns {string|*}
 */
export const mapToNewVersionNumbers = version => {
  if (version.split(".").length === 1) {
    return `1.${version}.0`;
  }
  if (version.split(".").length === 2) {
    return `1.${version}`;
  }
  return version;
};

class ANewVersionIsAvailable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      lastVersion: -1
    };

    this.setState = this.setState.bind(this);
    this.displayNone = this.displayNone.bind(this);
  }

  componentDidMount() {
    if (MODE !== "production") return;
    request({
      method: "GET",
      url: `${ARCHIFILTRE_SITE_URL}/api-version.json`
    })
      .then(result => {
        const lastVersion = mapToNewVersionNumbers(result.lastVersion);
        const currentVersion = version;
        if (versionComparator(currentVersion, lastVersion) === -1) {
          this.setState({
            display: true,
            lastVersion
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  displayNone() {
    this.setState({
      display: false
    });
  }

  download() {
    shell.openExternal(ARCHIFILTRE_SITE_URL);
  }

  render() {
    const { display, lastVersion } = this.state;
    const { t } = this.props;
    if (!display) return false;
    return (
      <div className="grid-x" style={bannerStyle}>
        <div className="cell auto">
          <div className="grid-x align-center align-middle">
            <div className="cell shrink" style={cellStyle}>
              {this.props.t("header.aNewVersionIsOut", {
                version: lastVersion
              })}
            </div>
            <div className="cell shrink" style={cellStyle}>
              <Button
                id="download-last-version"
                onClick={this.download}
                color={ButtonColor.INFO}
              >
                {t("header.downloadIt")}
              </Button>
            </div>
          </div>
        </div>
        <div className="cell shrink" style={cellStyle}>
          {mkRB(this.displayNone, "X", true, "rgba(224, 77, 28, 0.31)")}
        </div>
      </div>
    );
  }
}

export default withTranslation()(ANewVersionIsAvailable);
