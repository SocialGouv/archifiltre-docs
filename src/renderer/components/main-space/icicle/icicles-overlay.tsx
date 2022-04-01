import { noop } from "lodash";
import React, { memo } from "react";

import type { DimsMap } from "./icicle";
import { IcicleRect } from "./icicle-rect";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";

export interface IciclesOverlayProps {
  dimsMap: DimsMap;
  fillColor: FillColor;
  ids: string[];
  onIcicleRectClickHandler: IcicleMouseActionHandler;
  onIcicleRectDoubleClickHandler: IcicleMouseActionHandler;
  onIcicleRectMouseOverHandler: IcicleMouseActionHandler;
  opacity: number;
}

const _IciclesOverlay: React.FC<IciclesOverlayProps> = ({
  opacity,
  dimsMap,
  ids,
  fillColor,
  onIcicleRectClickHandler,
  onIcicleRectDoubleClickHandler,
  onIcicleRectMouseOverHandler,
}) => {
  return (
    <>
      {ids.map((id) => {
        const dims = dimsMap[id];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!dims) {
          return <g key={id} />;
        }

        const { x, y, dx, dy } = dims;

        return (
          <IcicleRect
            key={id}
            id={id}
            x={x}
            y={y}
            dx={dx}
            dy={dy}
            opacity={opacity}
            fillColor={fillColor}
            onClickHandler={onIcicleRectClickHandler}
            onDoubleClickHandler={onIcicleRectDoubleClickHandler}
            onMouseOverHandler={onIcicleRectMouseOverHandler}
            registerDims={noop}
          />
        );
      })}
    </>
  );
};

_IciclesOverlay.displayName = "IciclesOverlay";

export const IciclesOverlay = memo(_IciclesOverlay);
