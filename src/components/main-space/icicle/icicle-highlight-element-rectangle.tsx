import { useAnimatedValue } from "hooks/use-animation";
import type { MouseEventHandler } from "react";
import React from "react";

import { useFileMoveActiveState } from "../workspace/file-move-provider";
import type { Dims } from "./icicle-rect";
import type { IcicleMouseActionHandler } from "./icicle-types";
import SvgRectangle from "./svg-rectangle";

interface IcicleHightlightElementRectangleProps {
    dims: Dims;
    highlightedElementId: string;
    highlightedElementTime: number;
    onClickHandler: IcicleMouseActionHandler;
    onDoubleClickHandler: IcicleMouseActionHandler;
    onMouseOverHandler: IcicleMouseActionHandler;
}

const ICICLE_HIGHLIGHT_DURATION = 3000;

const IcicleHightlightElementRectangle: React.FC<
    IcicleHightlightElementRectangleProps
> = ({
    dims,
    highlightedElementId,
    highlightedElementTime,
    onClickHandler,
    onDoubleClickHandler,
    onMouseOverHandler,
}) => {
    const highlightedElementControl = `${highlightedElementId}:${highlightedElementTime}`;

    const animatedOpacity = useAnimatedValue(
        1,
        0,
        ICICLE_HIGHLIGHT_DURATION,
        highlightedElementControl
    );

    const { isFileMoveActive } = useFileMoveActiveState();

    const dimsAndId = { dims: () => dims, id: highlightedElementId };

    const onClick: MouseEventHandler = (event) => {
        onClickHandler(dimsAndId, event);
    };

    const ouDoubleClick: MouseEventHandler = (event) => {
        onDoubleClickHandler(dimsAndId, event);
    };

    const onMouseOver: MouseEventHandler = (event) => {
        onMouseOverHandler(dimsAndId, event);
    };

    return (
        <g>
            <SvgRectangle
                x={dims.x}
                dx={dims.dx}
                y={dims.y}
                dy={dims.dy}
                fill="transparent"
                stroke="red"
                opacity={animatedOpacity}
                cursor={isFileMoveActive ? "move" : "pointer"}
                elementId={highlightedElementId}
                strokeWidth={3}
                onClickHandler={onClick}
                onDoubleClickHandler={ouDoubleClick}
                onMouseOverHandler={onMouseOver}
            />
        </g>
    );
};

export default IcicleHightlightElementRectangle;
