import React from "react";

const viewportHeight = 10;
const viewportWidth = 10;

// The arrow is as high as one tenth of the polygon
const arrowHeight = viewportHeight / 10;

const firstPoints = [
  "0 0",
  `${viewportWidth} 0`,
  `${viewportWidth} ${viewportHeight - arrowHeight}`,
  `${viewportWidth / 2} ${viewportHeight}`,
  `0 ${viewportHeight - arrowHeight}`,
  "0 0",
].join(" ");

const BreadcrumbPolyNew = ({ isFirst, isLast, color, opacity }) => (
  <svg
    viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
    preserveAspectRatio="none"
    height="100%"
    width="100%"
  >
    <polygon points={firstPoints} fill={color} style={{ opacity }} />
  </svg>
);

export default BreadcrumbPolyNew;
