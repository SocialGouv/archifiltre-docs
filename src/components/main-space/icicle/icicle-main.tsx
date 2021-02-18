import Paper from "@material-ui/core/Paper";
import { sum } from "lodash";
import React, {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import * as ArrayUtil from "util/array/array-util";
import { empty } from "util/function/function-util";
import MinimapBracket from "../minimap-bracket";
import Ruler from "../ruler";
import AnimatedIcicle from "./animated-icicle";
import Icicle from "./icicle";
import { Dims, DimsAndId } from "./icicle-rect";
import { FillColor } from "./icicle-types";
import { useFileMoveActiveState } from "hooks/use-file-move-active-state";
import { MoveElement, useMovableElements } from "hooks/use-movable-elements";
import BreadcrumbsNew from "../breadcrumb/breadcrumbs";
import { ElementWeightMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { makeZoomReducer, ZoomDirection } from "util/zoom/zoom-util";

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

const viewBoxWidth = 1000;
const viewBoxHeight = 300;
const ZOOM_SPEED = 1.1;
const zoomReducer = makeZoomReducer(ZOOM_SPEED, viewBoxWidth);

type IcicleMainProps = {
  aliases: AliasMap;
  comments: CommentsMap;
  tags: TagMap;
  originalPath: string;
  rootId: string;
  displayRoot: string[];
  fillColor: FillColor;
  hoveredElementId: string;
  lockedElementId: string;
  hoverSequence: string[];
  lockedSequence: string[];
  elementsToDelete: string[];
  getChildrenIdFromId: (id: string) => string[];
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  elementWeightMethod: ElementWeightMethod;
  maxDepth: number;
  zoomElement: (elementId) => void;
  lock: (id: string) => void;
  unlock: () => void;
  moveElement: (movedElementId: string, targetFolderId: string) => void;
  setFocus: (id: string) => void;
  setNoFocus: () => void;
  setNoHover: () => void;
};

const IcicleMain: FC<IcicleMainProps> = ({
  aliases,
  comments,
  tags,
  originalPath,
  rootId,
  displayRoot,
  fillColor,
  hoveredElementId,
  lockedElementId,
  hoverSequence,
  lockedSequence,
  elementsToDelete,
  getChildrenIdFromId,
  getFfByFfId,
  elementWeightMethod,
  maxDepth,
  zoomElement,
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
  const [zoomOffset, setZoomOffset] = useState(0);
  const [zoomRatio, setZoomRatio] = useState(1);

  const icicleHeight = viewBoxHeight;
  const icicleWidth = viewBoxWidth;

  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * Returns the total size of the child elements based on its id
   */
  const getElementTotalSize = useCallback(
    (id) => getFfByFfId(id).childrenTotalSize,
    [getFfByFfId]
  );

  /**
   * Returns the total number of children files of an element based on its id
   */
  const getElementChildrenFilesCount = useCallback(
    (id) => getFfByFfId(id).nbChildrenFiles,
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
  const computeWidthRec = useCallback(
    (ids, x, dx) => {
      const ans = [[x, dx]];
      if (ids.length < 2) {
        return ans;
      } else {
        const [parentId, childId] = ids;
        const childrenIds = getChildrenIdFromId(parentId);
        const widths = normalizeWidth(childrenIds.map(computeWidth)).map(
          (a) => a * dx
        );
        const cumulatedWidths = ArrayUtil.computeCumulative(widths);
        const childIndex = childrenIds.indexOf(childId);
        const childX = cumulatedWidths[childIndex] + x;
        const childDx = widths[childIndex];

        return ans.concat(computeWidthRec(ids.slice(1), childX, childDx));
      }
    },
    [getChildrenIdFromId, computeWidth]
  );

  /**
   * Normalizes the height based on the maxDepth of the file tree
   */
  const normalizeHeight = useCallback(() => icicleHeight / maxDepth, [
    icicleHeight,
    maxDepth,
  ]);

  /**
   * Determines if an icicle is in the viewport. It allows icicles not to be rendered if they are too far left
   * or too far right.
   */
  const isIcicleInViewport = useCallback(
    (x, elementWidth) => {
      const minimumDisplayedWidth = 1;
      const elementIsTooFarLeft = x + elementWidth < 0;
      const elementIsTooFarRight = x > viewBoxWidth;
      if (elementIsTooFarRight || elementIsTooFarLeft) {
        return false;
      }
      return elementWidth > minimumDisplayedWidth;
    },
    [icicleWidth, zoomOffset]
  );

  /**
   * Handles viewport click action
   */
  const onClickHandler = useCallback(() => {
    unlock();
  }, [unlock, setNoFocus]);

  /**
   * Handle viewport mouse leave.
   */
  const onMouseLeaveHandler = useCallback(() => {
    setNoFocus();
  }, [setNoFocus]);

  /**
   * Handles click on icicle rectangle
   */
  const onIcicleRectClickHandler = useCallback(
    ({ id, dims }, event) => {
      event.stopPropagation();
      lock(id);
      setLockedDims(dims());
    },
    [lock, setLockedDims]
  );

  /**
   * Handles double click on icicle rectangle
   */
  const onIcicleRectDoubleClickHandler = useCallback(
    ({ id }) => {
      zoomElement(id);
    },
    [zoomElement]
  );

  /**
   * Handles mouse over icicle rectangle
   */
  const onIcicleRectMouseOverHandler = useCallback(
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
  }, []);

  const { isFileMoveActive } = useFileMoveActiveState();

  const moveElementHandler = useCallback<MoveElement>(
    (newMovedElementId, targetFolderId) => {
      setMovedElementId(newMovedElementId);
      setMovedElementTime(Date.now());
      moveElement(newMovedElementId, targetFolderId);
    },
    [moveElement, setMovedElementId]
  );

  const { onIcicleMouseUp, onIcicleMouseDown } = useMovableElements(
    moveElementHandler
  );

  const onIcicleMouseWheel = useCallback(
    ({ wheelDirection, mousePosition }) => {
      const zoomState = {
        offset: zoomOffset,
        ratio: zoomRatio,
      };
      const zoomAction = {
        mousePosition: mousePosition * viewBoxWidth,
        zoomDirection:
          wheelDirection > 0 ? ZoomDirection.IN : ZoomDirection.OUT,
      };
      const { offset, ratio } = zoomReducer(zoomState, zoomAction);
      setZoomOffset(offset);
      setZoomRatio(ratio);
    },
    [setZoomOffset, setZoomRatio, zoomRatio]
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
            onMouseUp={isFileMoveActive ? onIcicleMouseUp : empty}
            onMouseDown={isFileMoveActive ? onIcicleMouseDown : empty}
          >
            <AnimatedIcicle
              aliases={aliases}
              comments={comments}
              x={0}
              y={0}
              dx={icicleWidth}
              dy={icicleHeight}
              tags={tags}
              elementsToDelete={elementsToDelete}
              rootId={rootId}
              displayRoot={displayRoot}
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
              computeWidthRec={computeWidthRec}
              movedElementId={movedElementId}
              movedElementTime={movedElementTime}
              zoomOffset={zoomOffset}
              zoomRatio={zoomRatio}
              onIcicleMouseWheel={onIcicleMouseWheel}
            />
          </svg>
        </IcicleWrapper>
        <RulerWrapper>
          <Ruler
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
              aliases={aliases}
              comments={comments}
              x={0}
              y={0}
              dx={icicleWidth}
              dy={icicleHeight}
              rootId={rootId}
              displayRoot={ArrayUtil.empty}
              getWidthFromId={computeWidth}
              elementsToDelete={elementsToDelete}
              normalizeWidth={normalizeWidth}
              trueFHeight={normalizeHeight}
              getChildrenIdFromId={getChildrenIdFromId}
              fillColor={fillColor}
              hoverSequence={hoverSequence}
              lockedSequence={lockedSequence}
              shouldRenderChild={shouldRenderChildMinimap}
              onIcicleRectClickHandler={empty}
              onIcicleRectDoubleClickHandler={empty}
              onIcicleRectMouseOverHandler={empty}
              computeWidthRec={computeWidthRec}
              tags={tags}
              zoomOffset={0}
              zoomRatio={1}
            />
            <MinimapBracket
              x={0}
              y={0}
              viewportWidth={viewBoxWidth}
              viewportHeight={viewBoxHeight}
              displayRoot={displayRoot}
              computeWidthRec={computeWidthRec}
            />
          </svg>
        </MinimapWrapper>
      </BreadcrumbsViewport>
    </Viewport>
  );
};

export default memo(IcicleMain);
