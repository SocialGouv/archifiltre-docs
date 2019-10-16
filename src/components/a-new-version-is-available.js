import React from "react";

import { request } from "util/http-util";
import version from "version";

import { mkB } from "components/Buttons/button";

import * as Color from "util/color-util";

import pick from "languages";

const { shell } = require("electron");

const text = v =>
  pick({
    en: `Version ${v} of Archifiltre is out!`,
    fr: `La version ${v} d'Archifiltre est sortie !`
  });

const buttonTr = pick({
  en: "download it!",
  fr: "téléchargez la !"
});

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

export default class ANewVersionIsAvailable extends React.PureComponent {
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
      url: "https://archifiltre.github.io/api-version/"
    })
      .then(result => {
        try {
          result = JSON.parse(result);
          const lastVersion = result.last_version;
          const currentVersion = version;

          if (isNaN(lastVersion) === false && typeof lastVersion === "number") {
            if (currentVersion < lastVersion) {
              this.setState({
                display: true,
                lastVersion
              });
            }
          }
        } catch (e) {} // eslint-disable-line no-empty
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
    shell.openExternal("https://archifiltre.github.io/");
  }

  render() {
    const { display, lastVersion } = this.state;
    if (!display) return false;
    return (
      <div className="grid-x" style={bannerStyle}>
        <div className="cell auto">
          <div className="grid-x align-center align-middle">
            <div className="cell shrink" style={cellStyle}>
              {text(lastVersion)}
            </div>
            <div className="cell shrink" style={cellStyle}>
              {mkB(
                this.download,
                buttonTr,
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
