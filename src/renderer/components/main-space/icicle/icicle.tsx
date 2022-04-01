import { noop } from "lodash";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import type {
  AliasMap,
  CommentsMap,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import type { TagMap } from "../../../reducers/tags/tags-types";
import { IcicleEnrichments } from "./icicle-enrichments";
import { IcicleHightlightElement } from "./icicle-highlight-element";
import type { Dims } from "./icicle-rect";
import type { IcicleRecursiveProps } from "./icicle-recursive";
import { IcicleRecursive } from "./icicle-recursive";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";
import { IciclesOverlay } from "./icicles-overlay";

export type DimsMap = Record<string, Dims>;

export interface IcicleProps {
  trueFHeight: () => number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  hoverSequence: string[];
  lockedSequence: string[];
  rootId: string;
  getWidthFromId: (id: string) => number;
  getChildrenIdFromId: (id: string) => string[];
  normalizeWidth: (width: number[]) => number[];
  shouldRenderChild: (xPosition: number, elementWidth: number) => boolean;
  fillColor: FillColor;
  onIcicleRectClickHandler: IcicleMouseActionHandler;
  onIcicleRectDoubleClickHandler: IcicleMouseActionHandler;
  onIcicleRectMouseOverHandler: IcicleMouseActionHandler;
  aliases: AliasMap;
  comments: CommentsMap;
  tags: TagMap;
  elementsToDelete: string[];
  movedElementId?: string;
  movedElementTime?: number;
  zoomOffset: number;
  zoomRatio: number;
  onIcicleMouseWheel?: (event: {
    wheelDirection: number;
    mousePosition: number;
  }) => void;
  /** Used for e2e */
  testId: string;
}

const _Icicle: React.FC<IcicleProps> = ({
  getWidthFromId,
  x,
  y,
  dx,
  dy,
  rootId,
  hoverSequence,
  lockedSequence,
  getChildrenIdFromId,
  normalizeWidth,
  trueFHeight,
  shouldRenderChild,
  fillColor,
  onIcicleRectClickHandler,
  onIcicleRectMouseOverHandler,
  onIcicleRectDoubleClickHandler,
  aliases,
  comments,
  tags,
  elementsToDelete,
  movedElementId = "",
  movedElementTime = 0,
  zoomOffset,
  zoomRatio,
  onIcicleMouseWheel = noop,
  testId,
}) => {
  const [dims, setDims] = useState<DimsMap>({});
  const dimsRef = useRef<DimsMap>({});
  const dimsUpdated = useRef<boolean>(false);
  const icicleRef = useRef<SVGGElement>(null);

  dimsUpdated.current = false;

  /**
   * Register the icicle dimensions to a reference
   */
  const registerDims: IcicleRecursiveProps["registerDims"] = useCallback(
    (dimX, dimDx, dimY, dimDy, id) => {
      if (!dimsUpdated.current) {
        dimsRef.current = {};
      }

      dimsUpdated.current = true;

      dimsRef.current[id] = {
        dx: dimDx,
        dy: dimDy,
        x: dimX,
        y: dimY,
      };
    },
    [dimsRef, dimsUpdated]
  );

  // TODO: missing deps?
  // If the dims reference was updated during the render cycle, we update the
  // state accordingly to rerender the overlays
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (dimsUpdated.current) {
      setDims(dimsRef.current);
    }
  });

  const onMouseWheel: React.SVGProps<SVGGElement>["onWheel"] = ({
    clientX,
    deltaY,
  }) => {
    const { x: rectX, width } =
      icicleRef.current?.getBoundingClientRect() ??
      (clientX as unknown as DOMRect); // TODO: why is Rect instead of number given by onWheelEvent?
    const mousePosition = (clientX - rectX) / width;
    const wheelDirection = deltaY > 1 ? 1 : -1;
    onIcicleMouseWheel({ mousePosition, wheelDirection });
  };

  const xc = zoomOffset;
  const dxc = dx / zoomRatio;

  const xPrime = (x + (x - xc)) * (dx / dxc);
  const dxPrime = dx * (dx / dxc);

  const sanitizedXPrime = Number.isNaN(xPrime) ? 0 : xPrime;
  const sanitizedDxPrime = Number.isNaN(dxPrime) ? 0 : dxPrime;
  const style =
    hoverSequence.length > 0 || lockedSequence.length > 0
      ? {
          opacity: 0.3,
        }
      : {};

  const lockedHovered =
    hoverSequence.length > 0
      ? lockedSequence.filter((id) => hoverSequence.includes(id))
      : lockedSequence;

  const lockedNotHovered = lockedSequence.filter(
    (id) => !hoverSequence.includes(id)
  );

  const unlockedHovered = hoverSequence.filter(
    (id) => !lockedSequence.includes(id)
  );

  const tagIdToHighlight = "";

  return (
    <g onWheel={onMouseWheel} ref={icicleRef}>
      <g style={style} data-test-id={testId}>
        <IcicleRecursive
          x={sanitizedXPrime}
          y={y}
          width={sanitizedDxPrime}
          height={dy}
          id={rootId}
          getWidthFromId={getWidthFromId}
          getChildrenIdFromId={getChildrenIdFromId}
          normalizeWidth={normalizeWidth}
          trueFHeight={trueFHeight}
          shouldRenderChild={shouldRenderChild}
          fillColor={fillColor}
          onClickHandler={onIcicleRectClickHandler}
          onDoubleClickHandler={onIcicleRectDoubleClickHandler}
          onMouseOverHandler={onIcicleRectMouseOverHandler}
          registerDims={registerDims}
        />
      </g>
      <IciclesOverlay
        dimsMap={dims}
        opacity={1}
        ids={lockedHovered}
        fillColor={fillColor}
        onIcicleRectClickHandler={onIcicleRectClickHandler}
        onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
      />
      <IciclesOverlay
        dimsMap={dims}
        opacity={0.6}
        ids={lockedNotHovered}
        fillColor={fillColor}
        onIcicleRectClickHandler={onIcicleRectClickHandler}
        onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
      />
      <IciclesOverlay
        dimsMap={dims}
        opacity={0.3}
        ids={unlockedHovered}
        fillColor={fillColor}
        onIcicleRectClickHandler={onIcicleRectClickHandler}
        onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
      />
      <IcicleEnrichments
        aliases={aliases}
        comments={comments}
        tags={tags}
        elementsToDelete={elementsToDelete}
        highlightedTagId={tagIdToHighlight}
        dims={dims}
        onClick={onIcicleRectClickHandler}
        onDoubleClick={onIcicleRectDoubleClickHandler}
        onMouseOver={onIcicleRectMouseOverHandler}
      />
      <IcicleHightlightElement
        dimsMap={dims}
        highlightedElementId={movedElementId}
        highlightedElementTime={movedElementTime}
        onClickHandler={onIcicleRectClickHandler}
        onDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onMouseOverHandler={onIcicleRectMouseOverHandler}
      />
    </g>
  );
};

_Icicle.displayName = "Icicle";

export const Icicle = memo(_Icicle);
