import React from "react";

import * as Color from "util/color-util";

const earliestColor = Color.toRgba(Color.leastRecentDate());
const latestColor = Color.toRgba(Color.mostRecentDate());
const svgWidth = 100;
const svgHeight = 5;
const cursorWidthRatio = 0.0075;
const cursorWidth = svgWidth * cursorWidthRatio;

const CURSOR_ARRAY_KEYS = [
  { key: "min", getter: (metadata) => metadata.minLastModified },
  { key: "median", getter: (metadata) => metadata.medianLastModified },
  { key: "max", getter: (metadata) => metadata.maxLastModified },
];

const Cursor = ({ ratio }) => (
  <g>
    <rect
      x={ratio * svgWidth - cursorWidth / 2}
      y={0}
      width={cursorWidth}
      height={svgHeight}
      fill="black"
    />
  </g>
);

const TimeGradient = ({ filesAndFoldersId, filesAndFoldersMetadata }) => {
  const rootId = "";

  const rootMetadata = filesAndFoldersMetadata[rootId];
  const maxTime = rootMetadata.maxLastModified;
  const minTime = rootMetadata.minLastModified;
  const computeRelativePosition = (time) =>
    (time - minTime) / (maxTime - minTime);

  let cursorArray = [];
  if (filesAndFoldersId) {
    const currentFileMetadata = filesAndFoldersMetadata[filesAndFoldersId];
    cursorArray = CURSOR_ARRAY_KEYS.map(({ key, getter }) => (
      <Cursor
        key={key}
        ratio={computeRelativePosition(getter(currentFileMetadata))}
      />
    ));

    cursorArray.push(
      <g key={"average"}>
        <circle
          cx={
            computeRelativePosition(currentFileMetadata.averageLastModified) *
            svgWidth
          }
          cy={svgHeight / 2}
          r={cursorWidth}
          fill="red"
        />
      </g>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={"0 0 " + svgWidth + " " + svgHeight}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <g>
        <defs>
          <linearGradient
            id="time-gradient-grad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: earliestColor }} />
            <stop offset="100%" style={{ stopColor: latestColor }} />
          </linearGradient>
        </defs>
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill="url(#time-gradient-grad1)"
        />
        {cursorArray}
      </g>
    </svg>
  );
};

export default TimeGradient;
