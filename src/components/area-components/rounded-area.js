import React from "react";
import { toRgba } from "../../util/color-util";

export const LIGHT = "area-light";
export const NORMAL = "area-normal";

const roundedAreaMarginSize = "15px";

const roundedAreaStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  borderRadius: "32px",
  overflow: "hidden",
  marginTop: roundedAreaMarginSize,
  marginBottom: roundedAreaMarginSize,
};

const styles = {
  [NORMAL]: {
    ...roundedAreaStyle,
    backgroundColor: toRgba([121, 121, 121, 0.4]),
  },
  [LIGHT]: {
    ...roundedAreaStyle,
    backgroundColor: toRgba([121, 121, 121, 0.15]),
  },
};

/**
 * An area with rounded angles to display content
 * @param children
 * @param color - The background color. Can be NORMAL or LIGHT.
 */
const RoundedArea = ({ children, color = NORMAL }) => (
  <div style={styles[color]}>{children}</div>
);

export default RoundedArea;
