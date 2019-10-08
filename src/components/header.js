import React from "react";

import version from "version";

import Dashboard from "components/dashboard-container.tsx";

import pick from "languages";

const { shell } = require("electron");

const title = pick({
  en: "Archifiltre",
  fr: "Archifiltre"
});

const what_new = pick({
  en: "What's new?",
  fr: "Quoi de neuf ?"
});

const onClick = event => {
  event.preventDefault();
  shell.openExternal("http://archifiltre.github.io/#changelog");
};

const Header = props => {
  return (
    <div className="grid-x grid-padding-y align-middle">
      <div className="cell auto" />
      <div className="cell small-3" style={{ paddingTop: "1.5em" }}>
        <span style={{ lineHeight: "1.5em" }}>
          <div style={{ fontSize: "2em" }}>
            <b className="font_playfair">{title}</b>
          </div>
          <div style={{ fontSize: "0.7em" }}>
            {"v" + version + " Kinky Kookaburra • "}
            <a target="_blank" onClick={onClick} role="link">
              {what_new}
            </a>
          </div>
        </span>
      </div>
      <div className="cell small-8">
        <Dashboard api={props.api} />
      </div>
      <div className="cell auto" />
    </div>
  );
};

export default Header;
