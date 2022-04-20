import type { SpringValue } from "@react-spring/web";
import { animated } from "@react-spring/web";
import React, { useCallback } from "react";

import type { DatumWithRectAndColor } from "./types";

export type RectMouseHandler<TDatum extends DatumWithRectAndColor> = (
  datum: TDatum,
  event: React.MouseEvent<SVGPathElement>
) => void;

export interface RectShapeProps<TDatum extends DatumWithRectAndColor> {
  datum: TDatum;
  onClick?: RectMouseHandler<TDatum>;
  onMouseEnter?: RectMouseHandler<TDatum>;
  onMouseLeave?: RectMouseHandler<TDatum>;
  onMouseMove?: RectMouseHandler<TDatum>;
  style: {
    borderColor: SpringValue<string>;
    borderWidth: number;
    color: SpringValue<string>;
    height: number;
    // height: SpringValue<number>;
    opacity: SpringValue<number>;
    transform: string;
    width: number;
    // width: SpringValue<number>;
  };
}

export const RectShape = <TDatum extends DatumWithRectAndColor>({
  datum,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: RectShapeProps<TDatum>): JSX.Element => {
  const handleClick: React.MouseEventHandler<SVGRectElement> = useCallback(
    (event) => onClick?.(datum, event),
    [onClick, datum]
  );

  const handleMouseEnter: React.MouseEventHandler<SVGRectElement> = useCallback(
    (event) => onMouseEnter?.(datum, event),
    [onMouseEnter, datum]
  );

  const handleMouseMove: React.MouseEventHandler<SVGRectElement> = useCallback(
    (event) => onMouseMove?.(datum, event),
    [onMouseMove, datum]
  );

  const handleMouseLeave: React.MouseEventHandler<SVGRectElement> = useCallback(
    (event) => onMouseLeave?.(datum, event),
    [onMouseLeave, datum]
  );

  return (
    <animated.rect
      data-id={datum.id}
      opacity={style.opacity}
      fill={datum.fill ?? style.color}
      transform={style.transform}
      stroke={style.borderColor}
      strokeWidth={style.borderWidth}
      onClick={onClick ? handleClick : undefined}
      onMouseEnter={onMouseEnter ? handleMouseEnter : undefined}
      onMouseMove={onMouseMove ? handleMouseMove : undefined}
      onMouseLeave={onMouseLeave ? handleMouseLeave : undefined}
      width={style.width}
      height={style.height}
    />
  );
};
