import React, { FunctionComponent } from "react";

export interface IcicleHightlightTagProps {
  opacity: number;
  ffId: string;
  dims: any;
  onClickFactory: (...props: any[]) => any;
  onDoubleClickFactory: (...props: any[]) => any;
  onMouseOverFactory: (...props: any[]) => any;
}

const IcicleHightlightTag: FunctionComponent<IcicleHightlightTagProps> = ({
  opacity,
  ffId,
  dims,
  onClickFactory,
  onDoubleClickFactory,
  onMouseOverFactory
}) => (
  <rect
    x={dims.x + 1}
    y={dims.y + 1}
    width={dims.dx - 2}
    height={dims.dy / 3}
    style={{ fill: "rgb(10, 50, 100)", stroke: "none", opacity }}
    onClick={onClickFactory(ffId)}
    onDoubleClick={onDoubleClickFactory(ffId)}
    onMouseOver={onMouseOverFactory(ffId)}
  />
);

export default IcicleHightlightTag;
