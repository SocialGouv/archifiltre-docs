import React from "react";

import pick from "languages";
import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";

const byteChar = pick({
  en: "B",
  fr: "o"
});

const Ruler = props => {
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
    getFfByFfId
  } = props;
  const rulerX = x;
  const rulerY = y;
  const rulerDx = dx;
  const rulerDy = dy;

  dims.x = Math.max(dims.x, rulerX);
  dims.dx = Math.min(dims.dx, rulerDx);

  let res;

  if (isFocused) {
    const text = makeRulerText(node_size, total_size, getFfByFfId(node_id));
    const mode = computeRulerTextDisplayMode(
      dims.x + dims.dx / 2,
      text.length,
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
          height="0.3em"
          onClick={e => {
            e.stopPropagation();
          }}
          onMouseOver={() => {}}
          style={{ fill: fillColor(node_id) }}
        />
        <text
          x={computeTextPosition(dims.x, dims.dx, rulerDx, mode)}
          y={rulerY + (rulerDy * 2) / 3}
          textAnchor={{ ORGANIC: "middle", LEFT: "start", RIGHT: "end" }[mode]}
        >
          {text}
        </text>
      </g>
    );
  } else {
    res = <g />;
  }

  return <g>{res}</g>;
};

export const octet2HumanReadableFormat = o => {
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

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

const getFilesAndFoldersNumber = node => {
  return isFile(node) ? null : `${node.nbChildrenFiles} fichier(s)`;
};

const makeRulerText = (nodeSize, totalSize, node) => {
  const filesAndFolderSize = octet2HumanReadableFormat(nodeSize);
  const percentage = precisionRound((100 * nodeSize) / totalSize, 1);
  const filesAndFoldersRatio = percentage < 0.1 ? "< 0.1%" : `${percentage}%`;
  const rulerInfo = [filesAndFoldersRatio, filesAndFolderSize];
  const filesAndFoldersNumber = getFilesAndFoldersNumber(node);
  if (filesAndFoldersNumber) rulerInfo.push(filesAndFoldersNumber);

  return rulerInfo.join(" | ");
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
    api: { icicle_state },
    getFfByFfId
  } = props;

  const nodeId = icicle_state.sequence().slice(-1)[0];
  const totalSize = getFfByFfId("").childrenTotalSize;
  const node = getFfByFfId(nodeId);
  const nodeSize = node ? node.childrenTotalSize : null;

  return (
    <Ruler
      {...props}
      dims={icicle_state.hover_dims()}
      isFocused={icicle_state.isFocused()}
      node_size={nodeSize}
      node_id={nodeId}
      total_size={totalSize}
    />
  );
}
