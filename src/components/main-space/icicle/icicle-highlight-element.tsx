import React, { FC } from "react";
import SvgRectangle from "./svg-rectangle";
import { DimsMap } from "./icicle";
import { empty } from "../../../util/function/function-util";
import { useAnimatedValue } from "../../../hooks/use-animation";
import { useFileMoveActiveState } from "../../../hooks/use-file-move-active-state";

type IcicleHightlightElementProps = {
  dimsMap: DimsMap;
  highlightedElementId: string;
  highlightedElementTime: number;
};

const ICICLE_HIGHLIGHT_DURATION = 3000;

const IcicleHightlightElement: FC<IcicleHightlightElementProps> = ({
  dimsMap,
  highlightedElementId,
  highlightedElementTime,
}) => {
  const dims = dimsMap[highlightedElementId];

  const highlightedElementControl = `${highlightedElementId}:${highlightedElementTime}`;

  const animatedOpacity = useAnimatedValue(
    1,
    0,
    ICICLE_HIGHLIGHT_DURATION,
    highlightedElementControl
  );

  const { isFileMoveActive } = useFileMoveActiveState();

  return !dims || !highlightedElementId ? null : (
    <g>
      <SvgRectangle
        x={dims.x}
        dx={dims.dx}
        y={dims.y}
        dy={dims.dy}
        fill="transparent"
        stroke="red"
        onClickHandler={empty}
        onDoubleClickHandler={empty}
        onMouseOverHandler={empty}
        opacity={animatedOpacity}
        cursor={isFileMoveActive ? "move" : "pointer"}
        elementId={highlightedElementId}
        strokeWidth={3}
      />
    </g>
  );
};

export default IcicleHightlightElement;
