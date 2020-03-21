import { sum } from "lodash";
import React, {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, clear } from "../../../animation-daemon";
import { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { decomposePathToElement } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../../reducers/tags/tags-types";
import * as ArrayUtil from "../../../util/array-util";
import * as FunctionUtil from "../../../util/function-util";
import BreadCrumbs from "../breadcrumb/breadcrumbs";
import MinimapBracket from "../minimap-bracket";
import Ruler from "../ruler";
import AnimatedIcicle from "./animated-icicle";
import Icicle from "./icicle";
import { DimsAndId } from "./icicle-rect";
import { FillColor } from "./icicle-types";

export type IcicleMouseHandler = (
  dimsAndId: DimsAndId,
  event: MouseEvent
) => void;

/**
 * The ratio of the svg taken by the icicle view.
 */
const ICICLES_VIEWBOX_RATIO = 3 / 4;

const MINIMAP_LEFT_MARGIN = 30;
const MINIMAP_TOP_MARGIN = 10;

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
  sequence: string[];
  hover_sequence: string[];
  elementsToDelete: string[];
  getChildrenIdFromId: (id: string) => string[];
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  width_by_size: boolean;
  maxDepth: number;
  isLocked: boolean;
  setDisplayRoot: (pathToElement: string[]) => void;
  lock: (pathToElement: string[], dims: any) => void;
  unlock: () => void;
  setFocus: (pathToElement: string[], dims: any) => void;
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
  sequence,
  hover_sequence: hoverSequence,
  elementsToDelete,
  getChildrenIdFromId,
  getFfByFfId,
  width_by_size: widthBySize,
  maxDepth,
  isLocked,
  setDisplayRoot,
  lock,
  unlock,
  setFocus,
  setNoFocus,
  setNoHover,
}) => {
  const [{ viewBoxHeight, viewBoxWidth }, setViewboxState] = useState({
    viewBoxHeight: 300,
    viewBoxWidth: 1000,
  });

  const icicleHeight = viewBoxHeight * ICICLES_VIEWBOX_RATIO;
  const icicleWidth = viewBoxWidth * ICICLES_VIEWBOX_RATIO;
  const breadcrumbsWidth = viewBoxWidth - icicleWidth;
  const rulerHeight = viewBoxHeight - icicleHeight;

  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * Setup the listeners for the zoom in / zoom out animations
   */
  useEffect(() => {
    const domElement = svgRef.current;
    let animationId;
    if (domElement) {
      const visible = () => true;
      const measure = () => {
        const width = domElement.width.baseVal.value;
        const height = domElement.height.baseVal.value;
        if (viewBoxHeight !== height || viewBoxWidth !== width) {
          setViewboxState({ viewBoxHeight: height, viewBoxWidth: width });
        }
      };
      const mutate = () => null;
      animationId = animate(visible, measure, mutate);
    }
    return () => clear(animationId);
  }, [svgRef, setViewboxState, viewBoxHeight, viewBoxWidth]);

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
  const normalizeHeight = useCallback((height) => height / maxDepth, [
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
    setNoFocus();
  }, [unlock, setNoFocus]);

  /**
   * Handle viewport mouse leave.
   */
  const onMouseLeaveHandler = useCallback(() => {
    if (!isLocked) {
      setNoFocus();
    }
  }, [isLocked, setNoFocus]);

  /**
   * Handles click on icicle rectangle
   */
  const onIcicleRectClickHandler = useCallback(
    ({ id, dims }, event) => {
      event.stopPropagation();
      lock(decomposePathToElement(id), dims());
    },
    [lock]
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
      setFocus(decomposePathToElement(id), dims());
    },
    [decomposePathToElement, setFocus]
  );

  /**
   * Handles mouse leaving an icicle rectangle
   */
  const onIcicleMouseLeave = useCallback(() => {
    setNoHover();
  }, []);

  const minimapX = icicleWidth + MINIMAP_LEFT_MARGIN;
  const minimapY = icicleHeight + MINIMAP_TOP_MARGIN;
  const minimapWidth = breadcrumbsWidth - MINIMAP_LEFT_MARGIN;
  const minimapHeight = rulerHeight - 2 * MINIMAP_TOP_MARGIN;

  const icicle = (
    <g>
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
        sequence={sequence}
        hover_sequence={hoverSequence}
        shouldRenderChild={isIcicleInViewport}
        onIcicleRectClickHandler={onIcicleRectClickHandler}
        onIcicleRectDoubleClickHandler={onIcicleRectDoubleClickHandler}
        onIcicleRectMouseOverHandler={onIcicleRectMouseOverHandler}
        onIcicleMouseLeave={onIcicleMouseLeave}
        computeWidthRec={computeWidthRec}
      />

      <Ruler
        api={api}
        getFfByFfId={getFfByFfId}
        x={0}
        y={icicleHeight}
        dx={icicleWidth}
        dy={rulerHeight}
        fillColor={fillColor}
      />

      <BreadCrumbs
        api={api}
        aliases={aliases}
        originalPath={originalPath}
        getFfByFfId={getFfByFfId}
        maxDepth={maxDepth}
        x={icicleWidth}
        dx={breadcrumbsWidth}
        dy={icicleHeight}
        trueFHeight={normalizeHeight}
        fillColor={fillColor}
      />

      <g>
        <rect
          x={minimapX}
          y={minimapY}
          width={Math.max(0, minimapWidth)}
          height={Math.max(0, minimapHeight)}
          style={{ fill: "white", opacity: "0.4" }}
        />
        <Icicle
          aliases={aliases}
          comments={comments}
          api={api}
          x={minimapX + 5}
          y={minimapY + 5}
          dx={minimapWidth - 10}
          dy={minimapHeight - 10}
          root_id={rootId}
          display_root={ArrayUtil.empty}
          fWidth={computeWidth}
          elementsToDelete={elementsToDelete}
          normalizeWidth={normalizeWidth}
          trueFHeight={normalizeHeight}
          getChildrenIdFromId={getChildrenIdFromId}
          fillColor={fillColor}
          sequence={sequence}
          hover_sequence={hoverSequence}
          shouldRenderChild={shouldRenderChildMinimap}
          onIcicleRectClickHandler={FunctionUtil.empty}
          onIcicleRectDoubleClickHandler={FunctionUtil.empty}
          onIcicleRectMouseOverHandler={FunctionUtil.empty}
          computeWidthRec={computeWidthRec}
          tags={tags}
        />
        <MinimapBracket
          x={minimapX + 5}
          y={minimapY + 5}
          dx={minimapWidth - 10}
          dy={minimapHeight - 10}
          display_root={displayRoot}
          computeWidthRec={computeWidthRec}
          fillColor={fillColor}
        />
      </g>
    </g>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      ref={svgRef}
      onClick={onClickHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {icicle}
    </svg>
  );
};

export default memo(IcicleMain);
