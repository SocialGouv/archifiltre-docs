import React from "react";
import RoundedArea, { LIGHT } from "./rounded-area";
import { toRgba } from "../../util/color-util";
import AreaTitle from "./area-title";
import AreaMessage from "./area-message";

const progressBarContainer = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const progressBarStyle = {
  position: "absolute",
  backgroundColor: toRgba([121, 121, 121, 0.3]),
  width: "70%",
  height: "100%",
};

const progressBarPercent = {
  position: "absolute",
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
};

const progressBarText = {
  textAlign: "left",
  maxWidth: "50%",
  paddingTop: "20px",
  paddingRight: "40px",
  paddingBottom: "20px",
  paddingLeft: "40px",
};

/**
 * Component for displaying a full width loading bar
 * @param children - The loading bar title
 * @param progress - The progress percentage of the loading bar
 */
const AreaLoadingBar = ({ children, progress = 0 }) => (
  <RoundedArea color={LIGHT}>
    <div style={progressBarContainer}>
      <div style={{ ...progressBarStyle, width: `${progress}%` }} />
      <div style={progressBarPercent}>
        <AreaMessage>{Math.round(progress)}%</AreaMessage>
      </div>
      <div style={progressBarText}>
        <AreaTitle>{children}</AreaTitle>
      </div>
    </div>
  </RoundedArea>
);

export default AreaLoadingBar;
