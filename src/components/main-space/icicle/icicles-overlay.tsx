import noop from "lodash/noop";
import React, { memo } from "react";

import type { DimsMap } from "./icicle";
import IcicleRect from "./icicle-rect";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";

interface IciclesOverlayProps {
    dimsMap: DimsMap;
    opacity: number;
    ids: string[];
    fillColor: FillColor;
    onIcicleRectClickHandler: IcicleMouseActionHandler;
    onIcicleRectDoubleClickHandler: IcicleMouseActionHandler;
    onIcicleRectMouseOverHandler: IcicleMouseActionHandler;
}

const IciclesOverlay: React.FC<IciclesOverlayProps> = ({
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
                        registerDims={noop}
                    />
                );
            })}
        </>
    );
};

export default memo(IciclesOverlay);
