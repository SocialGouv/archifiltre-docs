import React, { FC } from "react";

type MinimapBracketProps = {
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  displayRoot: string[];
  computeWidthRec: (displayRoot: string[], x: number, dx: number) => any;
};

const MinimapBracket: FC<MinimapBracketProps> = ({
  x,
  y,
  viewportWidth,
  viewportHeight,
  displayRoot,
  computeWidthRec,
}) => {
  if (displayRoot.length === 0) {
    return <g />;
  }
  const [minimapX, minimapUnboundWidth] = computeWidthRec(
    displayRoot,
    x,
    viewportWidth
  ).slice(-1)[0];

  const minimapWidth = Math.max(minimapUnboundWidth, 1);

  return (
    <g>
      <rect
        x={0}
        y={0}
        width={minimapX}
        height={viewportHeight}
        style={{ fill: "black", opacity: "0.4" }}
      />
      <rect
        x={minimapX + minimapWidth}
        y={y}
        width={viewportWidth - (minimapX + minimapWidth)}
        height={viewportHeight}
        style={{ fill: "black", opacity: "0.4" }}
      />
    </g>
  );
};

export default React.memo(MinimapBracket);
