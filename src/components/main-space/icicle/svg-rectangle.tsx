import React, { memo } from "react";

const SvgRectangle = ({
    x,
    y,
    dx,
    dy,
    onClickHandler,
    onDoubleClickHandler,
    onMouseOverHandler,
    fill,
    opacity,
    stroke,
    cursor,
    elementId,
    ignorePointerEvents = false,
    strokeWidth = 1,
}) => (
    <rect
        data-draggable-id={elementId}
        data-test-id={elementId}
        className="node"
        x={x}
        y={y}
        width={dx}
        height={dy}
        onClick={onClickHandler}
        onDoubleClick={onDoubleClickHandler}
        onMouseOver={onMouseOverHandler}
        onFocus={onMouseOverHandler}
        style={{
            cursor,
            fill,
            opacity,
            pointerEvents: ignorePointerEvents ? "none" : "inherit",
            stroke,
            strokeWidth,
        }}
    />
);

export default memo(SvgRectangle);
