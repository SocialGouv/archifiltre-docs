import React from "react";

const viewportHeight = 300;
const viewportWidth = 100;

// The arrow is as high as one tenth of the polygon
const arrowHeight = viewportHeight / 10;

/**
 * The path of points to draw the top polygon
 */
const firstPolygonPath = [
  "0 0",
  `${viewportWidth} 0`,
  `${viewportWidth} ${viewportHeight - arrowHeight}`,
  `${viewportWidth / 2} ${viewportHeight}`,
  `0 ${viewportHeight - arrowHeight}`,
  "0 0",
].join(" ");

/**
 * The path of points to draw the middle polygons
 */
const middlePolygonPath = [
  "0 0",
  `${viewportWidth / 2} ${arrowHeight}`,
  `${viewportWidth} 0`,
  `${viewportWidth} ${viewportHeight - arrowHeight}`,
  `${viewportWidth / 2} ${viewportHeight}`,
  `0 ${viewportHeight - arrowHeight}`,
  "0 0",
].join(" ");

/**
 * The path of points to draw the last polygon
 */
const lastPolygonPath = [
  "0 0",
  `${viewportWidth / 2} ${arrowHeight}`,
  `${viewportWidth} 0`,
  `${viewportWidth} ${viewportHeight}`,
  `0 ${viewportHeight}`,
  "0 0",
].join(" ");

const BreadcrumbPoly = ({ isFirst, isLast, color, opacity }) => (
  <svg
    viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
    preserveAspectRatio="none"
    height={`${100 + (!isLast ? (arrowHeight / viewportHeight) * 100 : 0)}%`}
    width="100%"
    style={{
      marginBottom: !isLast ? `${(arrowHeight / viewportHeight) * 100}%` : 0,
    }}
  >
    <polygon
      points={
        isFirst
          ? firstPolygonPath
          : isLast
          ? lastPolygonPath
          : middlePolygonPath
      }
      fill={color}
      style={{ opacity }}
      stroke="white"
      strokeWidth={viewportWidth / 20}
    />
  </svg>
);

export default BreadcrumbPoly;
