import React from "react";

const areaTitleStyle = {
  fontFamily: "QuicksandBold",
  fontSize: "1.5em"
};

/**
 * Standardized component for displaying title in a rounded area
 * @param children
 */
const AreaTitle = ({ children }) => <h3 style={areaTitleStyle}>{children}</h3>;

export default AreaTitle;
