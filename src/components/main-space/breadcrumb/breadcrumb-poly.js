import React from "react";

const BreadcrumbPoly = (props) => {
  const { x, y, dx, dy, isFirst, isLast, fillColor, opacity } = props;
  const notch = dy / 10;

  const points = [];
  const coord2Str = (x, y) => x + "," + y;
  const pushPoints = (x, y) => points.push(coord2Str(x, y));

  pushPoints(x, y);
  if (isFirst === false) {
    pushPoints(x + dx / 2, y + notch);
  }
  pushPoints(x + dx, y);
  pushPoints(x + dx, y + dy);
  if (isLast === false) {
    pushPoints(x + dx / 2, y + dy + notch);
  }
  pushPoints(x, y + dy);

  return (
    <polygon
      className="breadcrumb-poly"
      points={points.join(" ")}
      fill={fillColor}
      style={{ opacity }}
    />
  );
};

export default BreadcrumbPoly;
