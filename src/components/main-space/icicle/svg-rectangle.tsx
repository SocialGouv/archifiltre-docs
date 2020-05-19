import React, { memo } from "react";

const SvgRectangle = ({
  x,
  y,
  dx,
  dy,
  onClickHandler,
  onDoubleClickHandler,
  onMouseOverHandler,
  fill,
  opacity,
  stroke,
  cursor,
  elementId,
}) => (
  <rect
    data-draggable-id={elementId}
    data-test-id={elementId}
    className="node"
    x={x}
    y={y}
    width={dx}
    height={dy}
    onClick={onClickHandler}
    onDoubleClick={onDoubleClickHandler}
    onMouseOver={onMouseOverHandler}
    onFocus={onMouseOverHandler}
    style={{ fill, opacity, stroke, cursor }}
  />
);

export default memo(SvgRectangle);
