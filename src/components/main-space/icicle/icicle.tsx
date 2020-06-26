import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dims } from "./icicle-rect";
import IcicleRecursive from "./icicle-recursive";
import IcicleEnrichments from "./icicle-enrichments";
import { FillColor, IcicleMouseActionHandler } from "./icicle-types";
import IciclesOverlay from "./icicles-overlay";
import {
  AliasMap,
  CommentsMap,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../../reducers/tags/tags-types";
import IcicleHightlightElement from "./icicle-highlight-element";

export type DimsMap = {
  [id: string]: Dims;
};

export type IcicleProps = {
  trueFHeight: () => number;
  computeWidthRec: (ids: string[], x: number, dx: number) => [number, number][];
  displayRoot: string[];
  x: number;
  y: number;
  dx: number;
  dy: number;
  api: any;
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
};

const Icicle: FC<IcicleProps> = ({
  computeWidthRec,
  displayRoot,
  getWidthFromId,
  x,
  y,
  dx,
  dy,
  rootId,
  api: { icicle_state: icicleState },
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
}) => {
  const [dims, setDims] = useState<DimsMap>({});
  const dimsRef = useRef<DimsMap>({});
  const dimsUpdated = useRef<boolean>(false);

  dimsUpdated.current = false;

  /**
   * Register the icicle dimensions to a reference
   */
  const registerDims = useCallback(
    (dimX: number, dimDx: number, dimY: number, dimDy: number, id: string) => {
      if (!dimsUpdated.current) {
        dimsRef.current = {};
      }

      dimsUpdated.current = true;

      dimsRef.current[id] = {
        x: dimX,
        dx: dimDx,
        y: dimY,
        dy: dimDy,
      };
    },
    [dimsRef, dimsUpdated]
  );

  // If the dims reference was updated during the render cycle, we update the
  // state accordingly to rerender the overlays
  useEffect(() => {
    if (dimsUpdated.current) {
      setDims(dimsRef.current);
    }
  });

  const [xc, dxc] = computeWidthRec(displayRoot, x, dx).slice(-1)[0];

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

  const tagIdToHighlight: string = icicleState.tagIdToHighlight();

  return (
    <g>
      <g style={style}>
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
        viewportStartIndex={x}
        viewportWidth={dx}
        fillColor={fillColor}
        onIcicleRectClickHandler={onIcicleRectClickHandler}
        onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
      />
      <IciclesOverlay
        dimsMap={dims}
        opacity={0.6}
        ids={lockedNotHovered}
        viewportStartIndex={x}
        viewportWidth={dx}
        fillColor={fillColor}
        onIcicleRectClickHandler={onIcicleRectClickHandler}
        onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
      />
      <IciclesOverlay
        dimsMap={dims}
        opacity={0.3}
        ids={unlockedHovered}
        viewportStartIndex={x}
        viewportWidth={dx}
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

export default memo(Icicle);
