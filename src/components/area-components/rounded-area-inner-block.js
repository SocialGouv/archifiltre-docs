import React from "react";

const roundedAreaInnerBlockPadding = "30px";

const roundedAreaInnerBlockStyle = {
  paddingTop: roundedAreaInnerBlockPadding,
  paddingRight: roundedAreaInnerBlockPadding,
  paddingBottom: roundedAreaInnerBlockPadding,
  paddingLeft: roundedAreaInnerBlockPadding,
};

/**
 * Padded inner block for the rounded area
 * @param children
 */
const RoundedAreaInnerBlock = ({ children }) => (
  <div style={roundedAreaInnerBlockStyle}>{children}</div>
);

export default RoundedAreaInnerBlock;
