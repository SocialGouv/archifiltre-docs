import React from "react";

import { request } from "util/http-util";
import version from "version";

import { mkB } from "components/button";

import * as Color from "util/color-util";

import pick from "languages";

const { shell } = require("electron");

const text = v =>
  pick({
    en: `Version ${v} of Archifiltre is out!`,
    fr: `La version ${v} d'Archifiltre est sortie !`
  });

const button_tr = pick({
  en: "download it!",
  fr: "téléchargez la !"
});

const banner_style = {
  backgroundColor: Color.folder(),
  border: "0.1em black solid"
};

const cell_style = {
  padding: "0.3em 0.3em"
};

const button_style = {
  borderRadius: "3em"
};

export default class ANewVersionIsAvailable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      display: false,
      last_version: -1
    };

    this.setState = this.setState.bind(this);
    this.displayNone = this.displayNone.bind(this);
  }

  componentDidMount() {
    request({
      method: "GET",
      url: "https://archifiltre.github.io/api-version/"
    })
      .then(a => {
        try {
          a = JSON.parse(a);
          const last_version = a.last_version;
          const current_version = version;

          if (
            isNaN(last_version) === false &&
            typeof last_version === "number"
          ) {
            if (current_version < last_version) {
              this.setState({
                display: true,
                last_version
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
    const state = this.state;

    const display = state.display;
    const last_version = state.last_version;
    if (display) {
      return (
        <div className="grid-x" style={banner_style}>
          <div className="cell auto">
            <div className="grid-x align-center align-middle">
              <div className="cell shrink" style={cell_style}>
                {text(last_version)}
              </div>
              <div className="cell shrink" style={cell_style}>
                {mkB(
                  this.download,
                  button_tr,
                  true,
                  "rgb(23, 177, 251)",
                  button_style
                )}
              </div>
            </div>
          </div>
          <div className="cell shrink" style={cell_style}>
            {mkB(
              this.displayNone,
              "X",
              true,
              "rgba(224, 77, 28, 0.31)",
              button_style
            )}
          </div>
        </div>
      );
    } else {
      return false;
    }
  }
}
