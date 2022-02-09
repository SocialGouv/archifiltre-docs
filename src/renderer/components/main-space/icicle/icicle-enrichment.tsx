import React, { useCallback, useMemo } from "react";

import type { RgbFunc } from "../../../utils/color/color-util";
import type { IcicleMouseHandler } from "./icicle-main";
import type { Dims } from "./icicle-rect";

/* eslint-disable @typescript-eslint/naming-convention */
export enum EnrichmentTypes {
  TAG = 0,
  TO_DELETE = 1,
  ALIAS = 2,
  COMMENT = 3,
}

export enum OPACITY {
  HIGHLIGHTED = 1,
  NOT_HIGHLIGHTED = 0.2,
}
/* eslint-enable @typescript-eslint/naming-convention */

export const ENRICHMENT_COLORS: Record<EnrichmentTypes, RgbFunc> = {
  [EnrichmentTypes.TAG]: "rgb(10, 50, 100)",
  [EnrichmentTypes.TO_DELETE]: "rgb(250,0,0)",
  [EnrichmentTypes.ALIAS]: "rgb(145,218,242)",
  [EnrichmentTypes.COMMENT]: "rgb(3,161,214)",
};

export interface IcicleEnrichmentProps {
  ffId: string;
  dims: Dims;
  hasTag: boolean;
  isToDelete: boolean;
  hasAlias: boolean;
  hasComment: boolean;
  opacity: OPACITY;
  onClick: IcicleMouseHandler;
  onDoubleClick: IcicleMouseHandler;
  onMouseOver: IcicleMouseHandler;
}

export const IcicleEnrichment: React.FC<IcicleEnrichmentProps> = ({
  ffId,
  dims,
  hasTag,
  isToDelete,
  hasAlias,
  hasComment,
  opacity,
  onClick,
  onDoubleClick,
  onMouseOver,
}) => {
  const getDims = useCallback(() => dims, [dims]);
  const callbackParameter = useMemo(
    () => ({
      dims: getDims,
      id: ffId,
    }),
    [ffId, getDims]
  );
  const handleClick: NonNullable<React.SVGProps<SVGRectElement>["onClick"]> =
    useCallback(
      (event) => {
        onClick(callbackParameter, event);
      },
      [onClick, callbackParameter]
    );

  const handleDoubleClick: NonNullable<
    React.SVGProps<SVGRectElement>["onDoubleClick"]
  > = useCallback(
    (event) => {
      onDoubleClick(callbackParameter, event);
    },
    [onDoubleClick, callbackParameter]
  );

  const handleMouseOver: NonNullable<
    React.SVGProps<SVGRectElement>["onMouseOver"]
  > = useCallback(
    (event) => {
      onMouseOver(callbackParameter, event);
    },
    [onMouseOver, callbackParameter]
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!dims?.dx) {
    return null;
  }

  const width = dims.dx - 2;

  if (width <= 0) {
    return null;
  }

  const enrichments = [
    ...(isToDelete ? [EnrichmentTypes.TO_DELETE] : []),
    ...(hasAlias ? [EnrichmentTypes.ALIAS] : []),
    ...(hasComment ? [EnrichmentTypes.COMMENT] : []),
    ...(hasTag ? [EnrichmentTypes.TAG] : []),
  ];
  const heightDivider = Math.max(enrichments.length * 2, 3);

  return (
    <>
      {dims && // eslint-disable-line @typescript-eslint/no-unnecessary-condition
        enrichments.map((enrichmentType, index) => (
          <rect
            key={`enrichment-${ffId}-${enrichmentType}`}
            x={dims.x + 1}
            y={dims.y + 1 + (index * dims.dy) / heightDivider}
            width={width}
            height={dims.dy / heightDivider}
            style={{
              fill: ENRICHMENT_COLORS[enrichmentType],
              opacity,
              stroke: "none",
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseOver={handleMouseOver}
          />
        ))}
    </>
  );
};
