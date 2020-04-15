import React from "react";

import translations from "../../translations/translations";
import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { percent } from "../../util/numbers-util";

const byteChar = translations.t("common.byteChar");

/**
 * Returns a formatted text with the size percentage of the file or folder
 * @param nodeSize
 * @param totalSize
 * @returns {string}
 */
const makePercentageText = (nodeSize, totalSize) => {
  const percentage = percent(nodeSize, totalSize, { numbersOfDecimals: 1 });
  return percentage < 0.1 ? "< 0.1%" : `${percentage}%`;
};

/**
 * Returns a formatted text with the file or folder size and the number of files in it (for a folder only)
 * @param nodeSize
 * @param totalSize
 * @param node
 * @returns {string}
 */
const makeRulerText = (nodeSize, totalSize, node) => {
  const filesAndFolderSize = octet2HumanReadableFormat(nodeSize);
  const rulerInfo = ["", filesAndFolderSize];
  const filesAndFoldersNumber = getFilesAndFoldersNumber(node);
  if (filesAndFoldersNumber) rulerInfo.push(filesAndFoldersNumber);

  return rulerInfo.join(" | ");
};

const Ruler = (props) => {
  const {
    x,
    y,
    dx,
    dy,
    dims,
    isFocused,
    node_size,
    total_size,
    fillColor,
    node_id,
    getFfByFfId,
  } = props;
  const rulerX = x;
  const rulerY = y;
  const rulerDx = dx;
  const rulerDy = dy;

  dims.x = Math.max(dims.x, rulerX);
  dims.dx = Math.min(dims.dx, rulerDx);

  let res;

  if (isFocused) {
    const percentageText = makePercentageText(node_size, total_size);
    const rulerText = makeRulerText(
      node_size,
      total_size,
      getFfByFfId(node_id)
    );
    const mode = computeRulerTextDisplayMode(
      dims.x + dims.dx / 2,
      rulerText.length,
      rulerDx,
      4.2
    );

    res = (
      <g>
        <rect
          className="ruler"
          x={dims.x}
          y={rulerY + (rulerDy * 1) / 3}
          width={dims.dx}
          height={(rulerDy * 1) / 3}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ fill: fillColor(node_id) }}
        />
        <text
          x={computeTextPosition(dims.x, dims.dx, rulerDx, mode)}
          y={rulerY + (rulerDy * 2) / 3}
          textAnchor={{ ORGANIC: "middle", LEFT: "start", RIGHT: "end" }[mode]}
        >
          <tspan fontWeight="bold">{percentageText}</tspan>
          <tspan>{rulerText}</tspan>
        </text>
      </g>
    );
  } else {
    res = <g />;
  }

  return <g>{res}</g>;
};

export const octet2HumanReadableFormat = (o) => {
  const unit = byteChar;
  const To = o / Math.pow(1000, 4);
  if (To > 1) {
    return Math.round(To * 10) / 10 + " T" + unit;
  }
  const Go = o / Math.pow(1000, 3);
  if (Go > 1) {
    return Math.round(Go * 10) / 10 + " G" + unit;
  }
  const Mo = o / Math.pow(1000, 2);
  if (Mo > 1) {
    return Math.round(Mo * 10) / 10 + " M" + unit;
  }
  const ko = o / 1000;
  if (ko > 1) {
    return Math.round(ko * 10) / 10 + " k" + unit;
  }
  return o + " " + unit;
};

const getFilesAndFoldersNumber = (node) => {
  return isFile(node)
    ? null
    : `${node.nbChildrenFiles} ${translations.t("common.files")}`;
};

const computeRulerTextDisplayMode = (candidatePosition, l, w, fw) => {
  if (candidatePosition < l * fw) {
    return "LEFT";
  } else if (candidatePosition > w - l * fw) {
    return "RIGHT";
  } else {
    return "ORGANIC";
  }
};

const computeTextPosition = (x, dx, w, mode) => {
  return { ORGANIC: x + dx / 2, LEFT: 5, RIGHT: w - 5 }[mode];
};

export default function RulerApiToProps(props) {
  const {
    getFfByFfId,
    hoveredElementId,
    lockedElementId,
    hoveredDims,
    lockedDims,
  } = props;

  const isHovered = hoveredElementId !== "";
  const isLocked = lockedElementId !== "";
  const nodeId = hoveredElementId || lockedElementId;
  const totalSize = getFfByFfId("").childrenTotalSize;
  const node = getFfByFfId(nodeId);
  const nodeSize = node ? node.childrenTotalSize : null;

  return (
    <Ruler
      {...props}
      dims={isHovered ? hoveredDims : lockedDims}
      isFocused={isHovered || isLocked}
      node_size={nodeSize}
      node_id={nodeId}
      total_size={totalSize}
    />
  );
}
