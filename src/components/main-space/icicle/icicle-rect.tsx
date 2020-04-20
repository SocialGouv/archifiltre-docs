import React, { FC, useCallback, useEffect } from "react";

import * as FunctionUtil from "util/function/function-util";
import { FillColor } from "./icicle-types";
import SvgRectangle from "./svg-rectangle";
import { useFileMoveActiveState } from "../../../hooks/use-file-move-active-state";

export interface Dims {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface DimsAndId {
  id: string;
  dims: () => Dims;
}

type MouseHandler = (dimsAndId: DimsAndId, e: MouseEvent) => void;

enum CursorState {
  ACTIVE_ELEMENT_CURSOR = "pointer",
  INACTIVE_ELEMENT_CURSOR = "initial",
  MOVE_CURSOR = "move",
}

interface IcicleRectProps {
  opacity: number;
  x: number;
  dx: number;
  y: number;
  dy: number;
  id: string;
  fillColor: FillColor;
  registerDims: (
    x: number,
    dx: number,
    y: number,
    dy: number,
    id: string
  ) => void;
  onClickHandler: MouseHandler;
  onDoubleClickHandler: MouseHandler;
  onMouseOverHandler: MouseHandler;
}

const IcicleRect: FC<IcicleRectProps> = ({
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
    return { x, dx, y, dy };
  }, [x, dy, y, dy]);

  const onClick = useCallback(
    (event: MouseEvent) => {
      onClickHandler({ dims: getDims, id }, event);
    },
    [onClickHandler, getDims, id]
  );

  const onDoubleClick = useCallback(
    (event: MouseEvent) => {
      onDoubleClickHandler({ dims: getDims, id }, event);
    },
    [onDoubleClickHandler, getDims, id]
  );

  const onMouseOver = useCallback(
    (event: MouseEvent) => {
      onMouseOverHandler({ dims: getDims, id }, event);
    },
    [onMouseOverHandler, getDims, id]
  );

  const { isFileMoveActive } = useFileMoveActiveState();

  useEffect(() => {
    registerDims(x, dx, y, dy, id);
  });

  let cursor = CursorState.INACTIVE_ELEMENT_CURSOR;

  if (onClickHandler !== FunctionUtil.empty) {
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

export default IcicleRect;
