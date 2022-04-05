import React, { memo } from "react";

export interface MinimapBracketProps {
  viewportHeight: number;
  viewportWidth: number;
  zoomOffset: number;
  zoomRatio: number;
}

const _MinimapBracket: React.FC<MinimapBracketProps> = ({
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

_MinimapBracket.displayName = "MinimapBracket";

export const MinimapBracket = memo(_MinimapBracket);
