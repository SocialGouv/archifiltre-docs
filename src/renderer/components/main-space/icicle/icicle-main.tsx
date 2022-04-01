import Paper from "@material-ui/core/Paper";
import { noop, sum } from "lodash";
import type { MouseEvent } from "react";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import type { MoveElement } from "../../../hooks/use-movable-elements";
import { useMovableElements } from "../../../hooks/use-movable-elements";
import type {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { ElementWeightMethod } from "../../../reducers/icicle-sort-method/icicle-sort-method-types";
import type { TagMap } from "../../../reducers/tags/tags-types";
import { Breadcrumbs as BreadcrumbsNew } from "../breadcrumb/breadcrumbs";
import { MinimapBracket } from "../minimap-bracket";
import { Ruler } from "../ruler";
import { useFileMoveActiveState } from "../workspace/file-move-provider";
import { useZoomContext } from "../workspace/zoom-provider";
import { AnimatedIcicle } from "./animated-icicle";
import type { IcicleProps } from "./icicle";
import { Icicle } from "./icicle";
import type { Dims, DimsAndId } from "./icicle-rect";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";

export type IcicleMouseHandler = (
  dimsAndId: DimsAndId,
  event: MouseEvent
) => void;

const Viewport = styled(Paper)`
  display: flex;
  height: 97.5%;
  justify-content: space-between;
  padding: 5px;
`;

const IcicleViewport = styled.div`
  height: 100%;
  width: 74%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const IcicleWrapper = styled.div`
  height: 74%;
`;

const RulerWrapper = styled.div`
  height: 24%;
`;

const BreadcrumbsViewport = styled.div`
  height: 100%;
  width: 24%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const BreadcrumbsWrapper = styled.div`
  height: 74%;
`;

const MinimapWrapper = styled.div`
  height: 24%;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.4);
`;

/**
 * Returns the array of widths divided by the sum of the widths.
 * @param widths - the widths to normalize
 */
const normalizeWidth = (widths: number[]) => {
  const totalWidth = sum(widths);
  return widths.map((a) => a / totalWidth);
};

/**
 * Determines if a minimap child element should render based on its width. Width < 2.5 are not rendered.
 * @param x - Mock parameter to keep the same API as shouldRenderChild
 * @param elementWidth - The width of the element
 */
const shouldRenderChildMinimap = (x: number, elementWidth: number): boolean => {
  const minimumMinimapElementWidth = 2.5;

  return elementWidth > minimumMinimapElementWidth;
};

export const ZOOM_SPEED = 1.1;
const viewBoxWidth = 1000;
const viewBoxHeight = 300;

export interface IcicleMainProps {
  aliases: AliasMap;
  comments: CommentsMap;
  elementWeightMethod: ElementWeightMethod;
  elementsToDelete: string[];
  fillColor: FillColor;
  getAllChildrenFolderCount: (id: string) => number;
  getChildrenIdFromId: (id: string) => string[];
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  hoverSequence: string[];
  hoveredElementId: string;
  lock: (id: string) => void;
  lockedElementId: string;
  lockedSequence: string[];
  maxDepth: number;
  moveElement: (movedElementId: string, targetFolderId: string) => void;
  originalPath: string;
  rootId: string;
  setFocus: (id: string) => void;
  setNoFocus: () => void;
  setNoHover: () => void;
  tags: TagMap;
  unlock: () => void;
}

const _IcicleMain: React.FC<IcicleMainProps> = ({
  aliases,
  comments,
  tags,
  originalPath,
  rootId,
  fillColor,
  hoveredElementId,
  lockedElementId,
  hoverSequence,
  lockedSequence,
  elementsToDelete,
  getAllChildrenFolderCount,
  getChildrenIdFromId,
  getFfByFfId,
  elementWeightMethod,
  maxDepth,
  lock,
  unlock,
  moveElement,
  setFocus,
  setNoFocus,
  setNoHover,
}) => {
  const [hoveredDims, setHoveredDims] = useState<Dims | null>(null);
  const [lockedDims, setLockedDims] = useState<Dims | null>(null);
  const [movedElementId, setMovedElementId] = useState("");
  const [movedElementTime, setMovedElementTime] = useState(0);
  const {
    zoomIn,
    zoomOut,
    setZoom,
    setDefaultMousePosition,
    offset: zoomOffset,
    ratio: zoomRatio,
  } = useZoomContext();

  const icicleHeight = viewBoxHeight;
  const icicleWidth = viewBoxWidth;

  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * Returns the total size of the child elements based on its id
   */
  const getElementTotalSize = useCallback(
    (id: string) => getFfByFfId(id).childrenTotalSize,
    [getFfByFfId]
  );

  /**
   * Returns the total number of children files of an element based on its id
   */
  const getElementChildrenFilesCount = useCallback(
    (id: string) => getFfByFfId(id).nbChildrenFiles,
    [getFfByFfId]
  );

  /**
   * The function used to compute the width of an element. It will use the suitable computing method based on the
   * widthBySize boolean
   */
  const computeWidth = useMemo(
    () =>
      elementWeightMethod === ElementWeightMethod.BY_VOLUME
        ? getElementTotalSize
        : getElementChildrenFilesCount,
    [elementWeightMethod, getElementTotalSize, getElementChildrenFilesCount]
  );

  /**
   * Pretty obscure behaviour for now.
   */
  // -- never called...?
  // const computeWidthRec = useCallback(
  //     (ids: string[], x: number, dx: number): number[][] => {
  //         const ans = [[x, dx]];
  //         if (ids.length < 2) {
  //             return ans;
  //         } else {
  //             const [parentId, childId] = ids;
  //             const childrenIds = getChildrenIdFromId(parentId);
  //             const widths = normalizeWidth(
  //                 childrenIds.map(computeWidth)
  //             ).map((a) => a * dx);
  //             const cumulatedWidths = ArrayUtil.computeCumulative(widths);
  //             const childIndex = childrenIds.indexOf(childId);
  //             const childX = cumulatedWidths[childIndex] + x;
  //             const childDx = widths[childIndex];

  //             return ans.concat(
  //                 computeWidthRec(ids.slice(1), childX, childDx)
  //             );
  //         }
  //     },
  //     [getChildrenIdFromId, computeWidth]
  // );

  /**
   * Normalizes the height based on the maxDepth of the file tree
   */
  const normalizeHeight: IcicleProps["trueFHeight"] = useCallback(
    () => icicleHeight / maxDepth,
    [icicleHeight, maxDepth]
  );

  /**
   * Determines if an icicle is in the viewport. It allows icicles not to be rendered if they are too far left
   * or too far right.
   */
  const isIcicleInViewport: IcicleProps["shouldRenderChild"] = useCallback(
    (x, elementWidth) => {
      const minimumDisplayedWidth = 1;
      const elementIsTooFarLeft = x + elementWidth < 0;
      const elementIsTooFarRight = x > viewBoxWidth;
      if (elementIsTooFarRight || elementIsTooFarLeft) {
        return false;
      }
      return elementWidth > minimumDisplayedWidth;
    },
    []
  );

  /**
   * Handles viewport click action
   */
  const onClickHandler = useCallback(() => {
    unlock();
    setDefaultMousePosition(null);
  }, [unlock, setDefaultMousePosition]);

  /**
   * Handle viewport mouse leave.
   */
  const onMouseLeaveHandler = useCallback(() => {
    setNoFocus();
  }, [setNoFocus]);

  /**
   * Handles click on icicle rectangle
   */
  const onIcicleRectClickHandler: IcicleMouseActionHandler = useCallback(
    ({ id, dims }, event) => {
      event.stopPropagation();
      lock(id);
      const newDims = dims();
      setLockedDims(newDims);
      setDefaultMousePosition((newDims.x + newDims.dx / 2) / viewBoxWidth);
    },
    [lock, setLockedDims, setDefaultMousePosition]
  );

  /**
   * Handles double click on icicle rectangle
   */
  const onIcicleRectDoubleClickHandler: IcicleMouseActionHandler = useCallback(
    ({ dims }) => {
      const { x, dx } = dims();
      const newZoomOffset = zoomOffset + x / (viewBoxWidth * zoomRatio);
      const newZoomRatio = (zoomRatio * viewBoxWidth) / dx;
      setZoom(newZoomOffset, newZoomRatio);
    },
    [setZoom, zoomRatio, zoomOffset]
  );

  /**
   * Handles mouse over icicle rectangle
   */
  const onIcicleRectMouseOverHandler: IcicleMouseActionHandler = useCallback(
    ({ id, dims }) => {
      setHoveredDims(dims());
      setFocus(id);
    },
    [setFocus, setHoveredDims]
  );

  /**
   * Handles mouse leaving an icicle rectangle
   */
  const onIcicleMouseLeave = useCallback(() => {
    setNoHover();
  }, [setNoHover]);

  const { isFileMoveActive } = useFileMoveActiveState();

  const moveElementHandler: MoveElement = useCallback(
    (newMovedElementId, targetFolderId) => {
      setMovedElementId(newMovedElementId);
      setMovedElementTime(Date.now());
      moveElement(newMovedElementId, targetFolderId);
    },
    [moveElement, setMovedElementId]
  );

  const { onIcicleMouseUp, onIcicleMouseDown } =
    useMovableElements(moveElementHandler);

  const onIcicleMouseWheel: NonNullable<IcicleProps["onIcicleMouseWheel"]> =
    useCallback(
      ({ wheelDirection, mousePosition }) => {
        const zoomMethod = wheelDirection < 0 ? zoomIn : zoomOut;
        zoomMethod(mousePosition, ZOOM_SPEED);
      },
      [zoomIn, zoomOut]
    );

  return (
    <Viewport>
      <IcicleViewport>
        <IcicleWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            ref={svgRef}
            onClick={onClickHandler}
            onMouseLeave={onMouseLeaveHandler}
            onMouseUp={isFileMoveActive ? onIcicleMouseUp : noop}
            onMouseDown={isFileMoveActive ? onIcicleMouseDown : noop}
          >
            <AnimatedIcicle
              testId="main-icicle"
              aliases={aliases}
              comments={comments}
              x={0}
              y={0}
              dx={icicleWidth}
              dy={icicleHeight}
              tags={tags}
              elementsToDelete={elementsToDelete}
              rootId={rootId}
              getWidthFromId={computeWidth}
              normalizeWidth={normalizeWidth}
              trueFHeight={normalizeHeight}
              getChildrenIdFromId={getChildrenIdFromId}
              fillColor={fillColor}
              hoverSequence={hoverSequence}
              lockedSequence={lockedSequence}
              shouldRenderChild={isIcicleInViewport}
              onIcicleRectClickHandler={onIcicleRectClickHandler}
              onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
              onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
              onIcicleMouseLeave={onIcicleMouseLeave}
              movedElementId={movedElementId}
              movedElementTime={movedElementTime}
              zoomOffset={zoomOffset * viewBoxWidth}
              zoomRatio={zoomRatio}
              onIcicleMouseWheel={onIcicleMouseWheel}
            />
          </svg>
        </IcicleWrapper>
        <RulerWrapper>
          <Ruler
            getAllChildrenFolderCount={getAllChildrenFolderCount}
            getFfByFfId={getFfByFfId}
            widthUnit={viewBoxWidth}
            hoveredDims={hoveredDims}
            hoveredElementId={hoveredElementId}
            lockedDims={lockedDims}
            lockedElementId={lockedElementId}
            totalSize={viewBoxWidth}
            fillColor={fillColor}
          />
        </RulerWrapper>
      </IcicleViewport>
      <BreadcrumbsViewport>
        <BreadcrumbsWrapper>
          <BreadcrumbsNew
            aliases={aliases}
            originalPath={originalPath}
            fillColor={fillColor}
            depth={maxDepth}
            lockedSequence={lockedSequence}
            hoveredSequence={hoverSequence}
            getFfByFfId={getFfByFfId}
            onBreadcrumbClick={onIcicleRectClickHandler}
          />
        </BreadcrumbsWrapper>
        <MinimapWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <Icicle
              testId="minimap-icicle"
              aliases={aliases}
              comments={comments}
              x={0}
              y={0}
              dx={icicleWidth}
              dy={icicleHeight}
              rootId={rootId}
              getWidthFromId={computeWidth}
              elementsToDelete={elementsToDelete}
              normalizeWidth={normalizeWidth}
              trueFHeight={normalizeHeight}
              getChildrenIdFromId={getChildrenIdFromId}
              fillColor={fillColor}
              hoverSequence={hoverSequence}
              lockedSequence={lockedSequence}
              shouldRenderChild={shouldRenderChildMinimap}
              onIcicleRectClickHandler={noop}
              onIcicleRectDoubleClickHandler={noop}
              onIcicleRectMouseOverHandler={noop}
              tags={tags}
              zoomOffset={0}
              zoomRatio={1}
            />
            <MinimapBracket
              zoomOffset={zoomOffset}
              zoomRatio={zoomRatio}
              viewportWidth={viewBoxWidth}
              viewportHeight={viewBoxHeight}
            />
          </svg>
        </MinimapWrapper>
      </BreadcrumbsViewport>
    </Viewport>
  );
};

_IcicleMain.displayName = "IcicleMain";

export const IcicleMain = memo(_IcicleMain);
