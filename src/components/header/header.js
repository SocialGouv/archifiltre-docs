import React from "react";

import Dashboard from "components/header/dashboard/dashboard-container";
import ArchifiltreLogo from "./archifiltre-logo";

const Header = props => {
  return (
    <div className="grid-x grid-padding-y align-middle">
      <div className="cell auto" />
      <div className="cell small-3" style={{ paddingTop: "1.5em" }}>
        <ArchifiltreLogo />
      </div>
      <div className="cell small-8">
        <Dashboard api={props.api} />
      </div>
      <div className="cell auto" />
    </div>
  );
};

export default Header;
