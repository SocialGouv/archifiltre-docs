import React from "react";

import type { DimsMap } from "./icicle";
import { IcicleHightlightElementRectangle } from "./icicle-highlight-element-rectangle";
import type { IcicleMouseActionHandler } from "./icicle-types";

export interface IcicleHightlightElementProps {
    dimsMap: DimsMap;
    highlightedElementId: string;
    highlightedElementTime: number;
    onClickHandler: IcicleMouseActionHandler;
    onDoubleClickHandler: IcicleMouseActionHandler;
    onMouseOverHandler: IcicleMouseActionHandler;
}

export const IcicleHightlightElement: React.FC<
    IcicleHightlightElementProps
> = ({
    dimsMap,
    highlightedElementId,
    highlightedElementTime,
    onClickHandler,
    onDoubleClickHandler,
    onMouseOverHandler,
}) => {
    const dims = dimsMap[highlightedElementId];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return !dims || !highlightedElementId ? null : (
        <IcicleHightlightElementRectangle
            dims={dims}
            highlightedElementId={highlightedElementId}
            highlightedElementTime={highlightedElementTime}
            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
            onMouseOverHandler={onMouseOverHandler}
        />
    );
};
