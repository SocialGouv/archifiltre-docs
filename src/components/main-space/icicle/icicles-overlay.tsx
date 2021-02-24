import React, { FC, memo } from "react";
import { DimsMap } from "./icicle";
import IcicleRect from "./icicle-rect";
import * as FunctionUtil from "../../../util/function/function-util";
import { FillColor, IcicleMouseActionHandler } from "./icicle-types";

type IciclesOverlayProps = {
  dimsMap: DimsMap;
  opacity: number;
  ids: string[];
  fillColor: FillColor;
  onIcicleRectClickHandler: IcicleMouseActionHandler;
  onIcicleRectDoubleClickHandler: IcicleMouseActionHandler;
  onIcicleRectMouseOverHandler: IcicleMouseActionHandler;
};

const IciclesOverlay: FC<IciclesOverlayProps> = ({
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
            registerDims={FunctionUtil.empty}
          />
        );
      })}
    </>
  );
};

export default memo(IciclesOverlay);
