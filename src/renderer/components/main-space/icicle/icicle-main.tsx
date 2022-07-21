import { noop } from "lodash";
import type { ComponentType, MouseEvent } from "react";
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
import { Ruler } from "../ruler";
import { useFileMoveActiveState } from "../workspace/file-move-provider";
import { useZoomContext } from "../workspace/zoom-provider";
import { AnimatedIcicle } from "./animated-icicle";
import type { IcicleProps } from "./icicle";
import { normalizeWidth } from "./icicle-common";
import type { DefaultSidebarProps } from "./icicle-default-sidebar";
import { DefaultSidebar } from "./icicle-default-sidebar";
import { LargeBlock, Layout } from "./icicle-layout";
import type { Dims, DimsAndId } from "./icicle-rect";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";

export type IcicleMouseHandler = (
  dimsAndId: DimsAndId,
  event: MouseEvent
) => void;

const IcicleWrapper = styled.div`
  height: 74%;
`;

const RulerWrapper = styled.div`
  height: 24%;
`;

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
  rightSidebar?: ComponentType<DefaultSidebarProps>;
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
  rightSidebar = DefaultSidebar,
}) => {
  const Sidebar = rightSidebar;
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
    <Layout>
      <LargeBlock>
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
      </LargeBlock>
      <Sidebar
        aliases={aliases}
        comments={comments}
        tags={tags}
        zoomOffset={zoomOffset}
        zoomRatio={zoomRatio}
        computeWidth={computeWidth}
        elementsToDelete={elementsToDelete}
        rootId={rootId}
        getChildrenIdFromId={getChildrenIdFromId}
        fillColor={fillColor}
        hoverSequence={hoverSequence}
        lockedSequence={lockedSequence}
        icicleWidth={icicleWidth}
        icicleHeight={icicleHeight}
        getFfByFfId={getFfByFfId}
        onBreadcrumbClick={onIcicleRectClickHandler}
        normalizeHeight={normalizeHeight}
        maxDepth={maxDepth}
        originalPath={originalPath}
      />
    </Layout>
  );
};

_IcicleMain.displayName = "IcicleMain";

export const IcicleMain = memo(_IcicleMain);
