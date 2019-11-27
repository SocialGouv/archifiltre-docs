import React from "react";
import RoundedArea from "../area-components/rounded-area";

const refreshButtonStyle = {
  height: "100%",
  cursor: "pointer"
};

const refreshButtonContent = {
  height: "100%",
  backgroundImage: "url(imgs/refresh.png)",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  margin: "0.3em"
};

const refreshButtonContainerStyle = {
  width: "2em",
  height: "2em"
};

/**
 * A button with a refresh symbol
 * @param onClick
 */
const RefreshButton = ({ onClick }) => (
  <div style={refreshButtonContainerStyle}>
    <RoundedArea>
      <button onClick={onClick} style={refreshButtonStyle}>
        <div style={refreshButtonContent}></div>
      </button>
    </RoundedArea>
  </div>
);

export default RefreshButton;
