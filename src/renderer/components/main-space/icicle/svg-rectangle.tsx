import React, { memo } from "react";

export interface SvgRectangleProps {
  cursor: NonNullable<React.CSSProperties["cursor"]>;
  dx: NonNullable<React.SVGAttributes<SVGRectElement>["width"]>;
  dy: NonNullable<React.SVGAttributes<SVGRectElement>["height"]>;
  elementId: string;
  fill: NonNullable<React.CSSProperties["fill"]>;
  ignorePointerEvents?: boolean;
  onClickHandler: NonNullable<React.SVGAttributes<SVGRectElement>["onClick"]>;
  onDoubleClickHandler: NonNullable<
    React.SVGAttributes<SVGRectElement>["onDoubleClick"]
  >;
  onMouseOverHandler: NonNullable<
    React.SVGAttributes<SVGRectElement>["onFocus"] &
      React.SVGAttributes<SVGRectElement>["onMouseOver"]
  >;
  opacity: NonNullable<React.CSSProperties["opacity"]>;
  stroke: NonNullable<React.CSSProperties["stroke"]>;
  strokeWidth?: React.CSSProperties["strokeWidth"];
  x: NonNullable<React.SVGAttributes<SVGRectElement>["x"]>;
  y: NonNullable<React.SVGAttributes<SVGRectElement>["y"]>;
}
const _SvgRectangle: React.FC<SvgRectangleProps> = ({
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
  ignorePointerEvents = false,
  strokeWidth = 1,
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
    style={{
      cursor,
      fill,
      opacity,
      pointerEvents: ignorePointerEvents ? "none" : "inherit",
      stroke,
      strokeWidth,
    }}
  />
);

_SvgRectangle.displayName = "SvgRectangle";

export const SvgRectangle = memo(_SvgRectangle);
