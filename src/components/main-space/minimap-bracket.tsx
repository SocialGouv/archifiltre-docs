import React, { FC, useMemo } from "react";

type MinimapBracketProps = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  displayRoot: string[];
  computeWidthRec: (displayRoot: string[], x: number, dx: number) => any;
};

const MinimapBracket: FC<MinimapBracketProps> = ({
  x,
  y,
  dx,
  dy,
  displayRoot,
  computeWidthRec,
}) => {
  if (displayRoot.length) {
    return <g />;
  }
  const [minimapX, minimapUnboundWidth] = computeWidthRec(
    displayRoot,
    x,
    dx
  ).slice(-1)[0];

  const minimapWidth = useMemo(() => Math.max(minimapUnboundWidth, 1), []);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={minimapX - x}
        height={dy}
        style={{ fill: "black", opacity: "0.4" }}
      />
      <rect
        x={minimapX + minimapWidth}
        y={y}
        width={x + dx - (minimapX + minimapWidth)}
        height={dy}
        style={{ fill: "black", opacity: "0.4" }}
      />
    </g>
  );
};

export default React.memo(MinimapBracket);
