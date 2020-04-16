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
import { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { decomposePathToElement } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../../reducers/tags/tags-types";
import * as ArrayUtil from "../../../util/array-util";
import { empty } from "../../../util/function-util";
import MinimapBracket from "../minimap-bracket";
import Ruler from "../ruler";
import AnimatedIcicle from "./animated-icicle";
import Icicle from "./icicle";
import { Dims, DimsAndId } from "./icicle-rect";
import { FillColor } from "./icicle-types";
import { useFileMoveActiveState } from "../../../hooks/use-file-move-active-state";
import { useMovableElements } from "../../../hooks/use-movable-elements";
import BreadcrumbsNew from "../breadcrumb/breadcrumbs-new";

export type IcicleMouseHandler = (
  dimsAndId: DimsAndId,
  event: MouseEvent
) => void;

const Viewport = styled.div`
  display: flex;
  height: 100%;
`;

const IcicleViewport = styled.div`
  height: 100%;
  width: 75%;
`;

const IcicleWrapper = styled.div`
  height: 75%;
`;

const RulerWrapper = styled.div`
  height: 25%;
`;

const BreadcrumbsViewport = styled.div`
  height: 100%;
  width: 25%;
`;

const BreadcrumbsWrapper = styled.div`
  height: 75%;
`;

const MinimapWrapper = styled.div`
  height: 25%;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.4);
`;

/**
 * Returns the array of widths divided by the sum of the widths.
 * @param widths - thes widths to normalize
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

interface IcicleMainProps {
  api: any;
  aliases: AliasMap;
  comments: CommentsMap;
  tags: TagMap;
  originalPath: string;
  root_id: string;
  display_root: string;
  fillColor: FillColor;
  hoveredElementId: string;
  lockedElementId: string;
  hoverSequence: string[];
  lockedSequence: string[];
  elementsToDelete: string[];
  getChildrenIdFromId: (id: string) => string[];
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  width_by_size: boolean;
  maxDepth: number;
  setDisplayRoot: (pathToElement: string[]) => void;
  lock: (id: string) => void;
  unlock: () => void;
  moveElement: (movedElementId: string, targetFolderId: string) => void;
  setFocus: (id: string) => void;
  setNoFocus: () => void;
  setNoHover: () => void;
}

const IcicleMain: FC<IcicleMainProps> = ({
  api,
  aliases,
  comments,
  tags,
  originalPath,
  root_id: rootId,
  display_root: displayRoot,
  fillColor,
  hoveredElementId,
  lockedElementId,
  hoverSequence,
  lockedSequence,
  elementsToDelete,
  getChildrenIdFromId,
  getFfByFfId,
  width_by_size: widthBySize,
  maxDepth,
  setDisplayRoot,
  lock,
  unlock,
  moveElement,
  setFocus,
  setNoFocus,
  setNoHover,
}) => {
  const viewBoxWidth = 1000;
  const viewBoxHeight = 300;

  const [hoveredDims, setHoveredDims] = useState<Dims | null>(null);
  const [lockedDims, setLockedDims] = useState<Dims | null>(null);

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
    () => (widthBySize ? getElementTotalSize : getElementChildrenFilesCount),
    [widthBySize, getElementTotalSize, getElementChildrenFilesCount]
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
      const xWindow = 0;
      const dxWindow = icicleWidth - 1;
      const elementIsTooFarRight = x + elementWidth < xWindow;
      const elementIsTooFarLeft = xWindow + dxWindow < x;
      if (elementIsTooFarRight || elementIsTooFarLeft) {
        return false;
      }
      return elementWidth > minimumDisplayedWidth;
    },
    [icicleWidth]
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
      setDisplayRoot(decomposePathToElement(id));
    },
    [decomposePathToElement, setDisplayRoot]
  );

  /**
   * Handles mouse over icicle rectangle
   */
  const onIcicleRectMouseOverHandler = useCallback(
    ({ id, dims }) => {
      setHoveredDims(dims());
      setFocus(id);
    },
    [decomposePathToElement, setFocus, setHoveredDims]
  );

  /**
   * Handles mouse leaving an icicle rectangle
   */
  const onIcicleMouseLeave = useCallback(() => {
    setNoHover();
  }, []);

  const { isFileMoveActive } = useFileMoveActiveState();

  const { onIcicleMouseUp, onIcicleMouseDown } = useMovableElements(
    moveElement
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
              api={api}
              x={0}
              y={0}
              dx={icicleWidth}
              dy={icicleHeight}
              tags={tags}
              elementsToDelete={elementsToDelete}
              root_id={rootId}
              display_root={displayRoot}
              fWidth={computeWidth}
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
            depth={maxDepth}
            lockedSequence={lockedSequence}
            getFfByFfId={getFfByFfId}
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
              api={api}
              x={0}
              y={0}
              dx={icicleWidth}
              dy={icicleHeight}
              root_id={rootId}
              display_root={ArrayUtil.empty}
              fWidth={computeWidth}
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
            />
            <MinimapBracket
              x={0}
              y={0}
              dx={viewBoxWidth}
              dy={viewBoxHeight}
              display_root={displayRoot}
              computeWidthRec={computeWidthRec}
              fillColor={fillColor}
            />
          </svg>
        </MinimapWrapper>
      </BreadcrumbsViewport>
    </Viewport>
  );
};

export default memo(IcicleMain);
