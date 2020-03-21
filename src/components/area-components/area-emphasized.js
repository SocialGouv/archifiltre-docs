import React from "react";

const areaEmphasizedStyle = {
  fontFamily: "QuicksandBold",
  fontStyle: "italic",
  fontSize: "20px",
};

/**
 * Standardized component for displaying emphasized text
 */
const AreaEmphasized = ({ children }) => (
  <span style={areaEmphasizedStyle}>{children}</span>
);

export default AreaEmphasized;
