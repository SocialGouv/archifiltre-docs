import React from "react";

import BTRButton from "components/Buttons/back-to-root-button";
import ToggleChangeSkin from "components/toggle-change-skin";
import ToggleWidthBySize from "components/toggle-width-by-size";

const grid_style = {
  background: "white",
  borderRadius: "5em",
  minHeight: "2.5em",
  maxHeight: "2.5em",
  padding: "0.2em 1em",
  margin: "0.5em 0"
};

const NavigationBar = props => {
  const api = props.api;

  return (
    <div style={grid_style} className="grid-x align-middle">
      <div className="cell small-2">
        <BTRButton api={api} />
      </div>
      <div className="cell small-4">
        <div className="flex-container">
          <div className="flex-child-grow" />
          <div className="flex-child-auto">
            <ToggleChangeSkin api={api} />
          </div>
        </div>
      </div>
      <div className="cell small-4">
        <div className="flex-container">
          <div className="flex-child-grow" />
          <div className="flex-child-auto">
            <ToggleWidthBySize api={api} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
