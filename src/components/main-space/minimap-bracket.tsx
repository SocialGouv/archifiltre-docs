import React, { FC } from "react";

type MinimapBracketProps = {
  zoomOffset: number;
  zoomRatio: number;
  viewportWidth: number;
  viewportHeight: number;
};

const MinimapBracket: FC<MinimapBracketProps> = ({
  zoomOffset,
  zoomRatio,
  viewportWidth,
  viewportHeight,
}) => {
  const rightRectangleStart = (zoomOffset + 1 / zoomRatio) * viewportWidth;
  const rectangleStyle = { fill: "black", opacity: "0.4" };

  return (
    <g>
      <rect
        x={0}
        y={0}
        width={viewportWidth * zoomOffset}
        height={viewportHeight}
        style={rectangleStyle}
      />
      <rect
        x={rightRectangleStart}
        y={0}
        width={viewportWidth - rightRectangleStart}
        height={viewportHeight}
        style={rectangleStyle}
      />
    </g>
  );
};

export default React.memo(MinimapBracket);
