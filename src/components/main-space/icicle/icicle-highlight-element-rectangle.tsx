import React from "react";

import { useAnimatedValue } from "../../../hooks/use-animation";
import { useFileMoveActiveState } from "../workspace/file-move-provider";
import type { Dims } from "./icicle-rect";
import type { IcicleMouseActionHandler } from "./icicle-types";
import type { SvgRectangleProps } from "./svg-rectangle";
import { SvgRectangle } from "./svg-rectangle";

interface IcicleHightlightElementRectangleProps {
    dims: Dims;
    highlightedElementId: string;
    highlightedElementTime: number;
    onClickHandler: IcicleMouseActionHandler;
    onDoubleClickHandler: IcicleMouseActionHandler;
    onMouseOverHandler: IcicleMouseActionHandler;
}

const ICICLE_HIGHLIGHT_DURATION = 3000;

export const IcicleHightlightElementRectangle: React.FC<
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

    const onClick: SvgRectangleProps["onClickHandler"] = (event) => {
        onClickHandler(dimsAndId, event);
    };

    const ouDoubleClick: SvgRectangleProps["onDoubleClickHandler"] = (
        event
    ) => {
        onDoubleClickHandler(dimsAndId, event);
    };

    const onMouseOver: SvgRectangleProps["onMouseOverHandler"] = (event) => {
        onMouseOverHandler(dimsAndId, event as React.MouseEvent);
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
