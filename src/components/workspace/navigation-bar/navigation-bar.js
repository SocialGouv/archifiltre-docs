import React from "react";

import BackToRootButton from "components/buttons/back-to-root-button";
import ToggleChangeSkin from "components/workspace/navigation-bar/toggle-change-skin";
import ToggleWidthBySize from "components/workspace/navigation-bar/toggle-width-by-size";

const gridStyle = {
  background: "white",
  borderRadius: "5px",
  minHeight: "2.5em",
  maxHeight: "2.5em",
  padding: "0.2em 1em",
  margin: "0.5em 0"
};

const NavigationBar = ({ api }) => (
  <div style={gridStyle} className="grid-x align-middle">
    <div className="cell small-2">
      <BackToRootButton api={api} />
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

export default NavigationBar;
