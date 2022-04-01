import { noop } from "lodash";
import React, { useCallback, useEffect } from "react";

import { useFileMoveActiveState } from "../workspace/file-move-provider";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";
import type { SvgRectangleProps } from "./svg-rectangle";
import { SvgRectangle } from "./svg-rectangle";

export interface Dims {
  dx: number;
  dy: number;
  x: number;
  y: number;
}

export interface DimsAndId {
  dims: () => Dims;
  id: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
enum CursorState {
  ACTIVE_ELEMENT_CURSOR = "pointer",
  INACTIVE_ELEMENT_CURSOR = "initial",
  MOVE_CURSOR = "move",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface IcicleRectProps {
  dx: number;
  dy: number;
  fillColor: FillColor;
  id: string;
  onClickHandler: IcicleMouseActionHandler;
  onDoubleClickHandler: IcicleMouseActionHandler;
  onMouseOverHandler: IcicleMouseActionHandler;
  opacity: number;
  registerDims: (
    x: number,
    dx: number,
    y: number,
    dy: number,
    id: string
  ) => void;
  x: number;
  y: number;
}

export const IcicleRect: React.FC<IcicleRectProps> = ({
  x,
  dx,
  y,
  dy,
  id,
  opacity,
  fillColor,
  registerDims,
  onClickHandler,
  onDoubleClickHandler,
  onMouseOverHandler,
}) => {
  /**
   * Formats the element dimensions into an object.
   */
  const getDims = useCallback(() => {
    return { dx, dy, x, y };
  }, [x, dx, y, dy]);

  const onClick: SvgRectangleProps["onClickHandler"] = useCallback(
    (event) => {
      onClickHandler({ dims: getDims, id }, event);
    },
    [onClickHandler, getDims, id]
  );

  const onDoubleClick: SvgRectangleProps["onDoubleClickHandler"] = useCallback(
    (event) => {
      onDoubleClickHandler({ dims: getDims, id }, event);
    },
    [onDoubleClickHandler, getDims, id]
  );

  const onMouseOver: SvgRectangleProps["onMouseOverHandler"] = useCallback(
    (event) => {
      onMouseOverHandler({ dims: getDims, id }, event as React.MouseEvent);
    },
    [onMouseOverHandler, getDims, id]
  );

  const { isFileMoveActive } = useFileMoveActiveState();

  useEffect(() => {
    registerDims(x, dx, y, dy, id);
  });

  let cursor = CursorState.INACTIVE_ELEMENT_CURSOR;

  // TODO: not safe
  if (onClickHandler !== noop) {
    cursor = CursorState.ACTIVE_ELEMENT_CURSOR;
  }
  if (isFileMoveActive) {
    cursor = CursorState.MOVE_CURSOR;
  }

  return (
    <g>
      <SvgRectangle
        elementId={id}
        key="rect"
        x={x}
        y={y}
        dx={dx}
        dy={dy}
        onClickHandler={onClick}
        onDoubleClickHandler={onDoubleClick}
        onMouseOverHandler={onMouseOver}
        fill={fillColor(id)}
        opacity={opacity}
        stroke={"#fff"}
        cursor={cursor}
      />
    </g>
  );
};
