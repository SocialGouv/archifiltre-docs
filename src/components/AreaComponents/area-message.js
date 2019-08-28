import React from "react";

const areaMessageStyle = {
  fontFamily: "QuickSand",
  fontSize: "1.5em"
};

/**
 * Standardized component for displaying messaged in a rounded area
 * @param children
 */
const AreaMessage = ({ children }) => (
  <span style={areaMessageStyle}>{children}</span>
);

export default AreaMessage;
