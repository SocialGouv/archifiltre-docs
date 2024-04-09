import { computeCumulative } from "@common/utils/array";
import React, { memo } from "react";

import { IcicleRect } from "./icicle-rect";
import { type FillColor, type IcicleMouseActionHandler } from "./icicle-types";

export interface IcicleRecursiveProps {
  fillColor: FillColor;
  getChildrenIdFromId: (id: string) => string[];
  getWidthFromId: (id: string) => number;
  height: number;
  id: string;
  normalizeWidth: (width: number[]) => number[];
  onClickHandler: IcicleMouseActionHandler;
  onDoubleClickHandler: IcicleMouseActionHandler;
  onMouseOverHandler: IcicleMouseActionHandler;
  registerDims: (x: number, dx: number, y: number, dy: number, id: string) => void;
  shouldRenderChild: (xPosition: number, elementWidth: number) => boolean;
  trueFHeight: () => number;
  width: number;
  x: number;
  y: number;
}

const _IcicleRecursive: React.FC<IcicleRecursiveProps> = ({
  id,
  x,
  width,
  y,
  height,
  getChildrenIdFromId,
  getWidthFromId,
  normalizeWidth,
  trueFHeight,
  shouldRenderChild,
  fillColor,
  onClickHandler,
  onDoubleClickHandler,
  onMouseOverHandler,
  registerDims,
}) => {
  const children = getChildrenIdFromId(id);
  const childrenWidth = normalizeWidth(children.map(getWidthFromId)).map(a => a * width);
  const cumulatedChildrenWidth = computeCumulative(childrenWidth);

  const childrenHeight = children.map(trueFHeight);

  const childrenComponents = children.map((childId, i) => {
    const childX = x + cumulatedChildrenWidth[i];
    const childWidth = childrenWidth[i];

    const isChildRendered = shouldRenderChild(childX, childWidth);

    if (!isChildRendered) {
      return <g key={`icicle-recursive-${childId}`} />;
    }

    const childY = y;
    const childHeight = childrenHeight[i];

    const nextDepthX = childX;
    const nextDepthWidth = childWidth;
    const nextDepthY = childY + childHeight;
    const nextDepthHeight = height - childHeight;

    return (
      <g key={`icicle-recursive-${childId}`}>
        <IcicleRect
          id={childId}
          x={childX}
          y={childY}
          dx={childWidth}
          dy={childHeight}
          opacity={1}
          fillColor={fillColor}
          onClickHandler={onClickHandler}
          onDoubleClickHandler={onDoubleClickHandler}
          onMouseOverHandler={onMouseOverHandler}
          registerDims={registerDims}
        />
        <IcicleRecursive
          x={nextDepthX}
          y={nextDepthY}
          width={nextDepthWidth}
          height={nextDepthHeight}
          id={childId}
          getWidthFromId={getWidthFromId}
          normalizeWidth={normalizeWidth}
          trueFHeight={trueFHeight}
          getChildrenIdFromId={getChildrenIdFromId}
          shouldRenderChild={shouldRenderChild}
          fillColor={fillColor}
          onClickHandler={onClickHandler}
          onDoubleClickHandler={onDoubleClickHandler}
          onMouseOverHandler={onMouseOverHandler}
          registerDims={registerDims}
        />
      </g>
    );
  });

  return <g>{childrenComponents}</g>;
};

_IcicleRecursive.displayName = "IcicleRecursive";

export const IcicleRecursive = memo(_IcicleRecursive);
