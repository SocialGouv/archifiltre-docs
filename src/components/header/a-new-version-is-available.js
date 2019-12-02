import React from "react";

import { request } from "util/http-util";
import version from "version";

import { mkB } from "components/buttons/button";

import * as Color from "util/color-util";

import { siteUrl } from "../../env";
import { withTranslation } from "react-i18next";

const { shell } = require("electron");

const bannerStyle = {
  backgroundColor: Color.folder(),
  border: "0.1em black solid"
};

const cellStyle = {
  padding: "0.3em 0.3em"
};

const buttonStyle = {
  borderRadius: "3em"
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
    request({
      method: "GET",
      url: `${siteUrl}/api-version.json`
    })
      .then(result => {
        const { lastVersion } = JSON.parse(result);
        const currentVersion = version;
        if (isNaN(lastVersion) === false && typeof lastVersion === "number") {
          if (currentVersion < lastVersion) {
            this.setState({
              display: true,
              lastVersion
            });
          }
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
    shell.openExternal(siteUrl);
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
              {mkB(
                this.download,
                t("header.downloadIt"),
                true,
                "rgb(23, 177, 251)",
                buttonStyle
              )}
            </div>
          </div>
        </div>
        <div className="cell shrink" style={cellStyle}>
          {mkB(
            this.displayNone,
            "X",
            true,
            "rgba(224, 77, 28, 0.31)",
            buttonStyle
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(ANewVersionIsAvailable);
