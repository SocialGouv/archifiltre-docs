import React from "react";

import version from "version";

import Dashboard from "components/header/dashboard/dashboard-container";

import { useTranslation } from "react-i18next";

const { shell } = require("electron");

const onClick = event => {
  event.preventDefault();
  shell.openExternal(`${ARCHIFILTRE_SITE_URL}/#changelog`);
};

const Header = props => {
  const { t } = useTranslation();
  return (
    <div className="grid-x grid-padding-y align-middle">
      <div className="cell auto" />
      <div className="cell small-3" style={{ paddingTop: "1.5em" }}>
        <span style={{ lineHeight: "1.5em" }}>
          <div style={{ fontSize: "2em" }}>
            <b className="font_playfair">Archifiltre</b>
          </div>
          <div style={{ fontSize: "0.7em" }}>
            {"v" + version + " Magic Moose • "}
            <a target="_blank" onClick={onClick} role="link">
              {t("report.whatsNew")}
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
