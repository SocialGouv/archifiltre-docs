import React, { FC } from "react";
import IcicleHightlightElementRectangle from "./icicle-highlight-element-rectangle";
import { DimsMap } from "./icicle";
import { IcicleMouseActionHandler } from "./icicle-types";

type IcicleHightlightElementProps = {
  dimsMap: DimsMap;
  highlightedElementId: string;
  highlightedElementTime: number;
  onClickHandler: IcicleMouseActionHandler;
  onDoubleClickHandler: IcicleMouseActionHandler;
  onMouseOverHandler: IcicleMouseActionHandler;
};

const IcicleHightlightElement: FC<IcicleHightlightElementProps> = ({
  dimsMap,
  highlightedElementId,
  highlightedElementTime,
  onClickHandler,
  onDoubleClickHandler,
  onMouseOverHandler,
}) => {
  const dims = dimsMap[highlightedElementId];

  return !dims || !highlightedElementId ? null : (
    <IcicleHightlightElementRectangle
      dims={dims}
      highlightedElementId={highlightedElementId}
      highlightedElementTime={highlightedElementTime}
      onClickHandler={onClickHandler}
      onDoubleClickHandler={onDoubleClickHandler}
      onMouseOverHandler={onMouseOverHandler}
    />
  );
};

export default IcicleHightlightElement;
