import React, { FC, useCallback, useMemo } from "react";
import { IcicleMouseHandler } from "./icicle-main";
import { Dims } from "./icicle-rect";

enum EnrichmentTypes {
  TAG,
  TO_DELETE
}

export enum OPACITY {
  HIGHLIGHTED = 1,
  NOT_HIGHLIGHTED = 0.2
}

const ENRICHMENT_COLORS = {
  [EnrichmentTypes.TAG]: "rgb(10, 50, 100)",
  [EnrichmentTypes.TO_DELETE]: "rgb(250,0,0)"
};

interface IcicleEnrichmentProps {
  ffId: string;
  dims: Dims;
  hasTag: boolean;
  isToDelete: boolean;
  opacity: OPACITY;
  onClick: IcicleMouseHandler;
  onDoubleClick: IcicleMouseHandler;
  onMouseOver: IcicleMouseHandler;
}

const IcicleEnrichment: FC<IcicleEnrichmentProps> = ({
  ffId,
  dims,
  hasTag,
  isToDelete,
  opacity,
  onClick,
  onDoubleClick,
  onMouseOver
}) => {
  const getDims = useCallback(() => dims, [dims]);
  const callbackParameter = useMemo(
    () => ({
      dims: getDims,
      id: ffId
    }),
    [ffId, getDims]
  );
  const handleClick = useCallback(event => onClick(callbackParameter, event), [
    onClick,
    callbackParameter
  ]);

  const handleDoubleClick = useCallback(
    event => onDoubleClick(callbackParameter, event),
    [onDoubleClick, callbackParameter]
  );

  const handleMouseOver = useCallback(
    event => onMouseOver(callbackParameter, event),
    [onMouseOver, callbackParameter]
  );

  const enrichments = [
    ...(hasTag ? [EnrichmentTypes.TAG] : []),
    ...(isToDelete ? [EnrichmentTypes.TO_DELETE] : [])
  ];
  const heightDivider = Math.max(enrichments.length * 2, 3);
  return (
    <>
      {enrichments.map((enrichmentType, index) => (
        <rect
          key={`enrichment-${ffId}-${enrichmentType}`}
          x={dims.x + 1}
          y={dims.y + 1 + (index * dims.dy) / heightDivider}
          width={dims.dx - 2}
          height={dims.dy / heightDivider}
          style={{
            fill: ENRICHMENT_COLORS[enrichmentType],
            opacity,
            stroke: "none"
          }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseOver={handleMouseOver}
        />
      ))}
    </>
  );
};

export default IcicleEnrichment;
