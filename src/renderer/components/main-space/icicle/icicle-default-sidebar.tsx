import { noop } from "lodash";
import React from "react";
import styled from "styled-components";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFolders,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { TagMap } from "../../../reducers/tags/tags-types";
import { Breadcrumbs as BreadcrumbsNew } from "../breadcrumb/breadcrumbs";
import { MinimapBracket } from "../minimap-bracket";
import { Icicle } from "./icicle";
import { normalizeWidth, VIEWBOX_HEIGHT, VIEWBOX_WIDTH } from "./icicle-common";
import { ColumnBlock } from "./icicle-layout";
import type { FillColor, IcicleMouseActionHandler } from "./icicle-types";

/**
 * Determines if a minimap child element should render based on its width. Width < 2.5 are not rendered.
 * @param x - Mock parameter to keep the same API as shouldRenderChild
 * @param elementWidth - The width of the element
 */
const shouldRenderChildMinimap = (x: number, elementWidth: number): boolean => {
  const minimumMinimapElementWidth = 2.5;

  return elementWidth > minimumMinimapElementWidth;
};

const BreadcrumbsWrapper = styled.div`
  height: 74%;
`;

const MinimapWrapper = styled.div`
  height: 24%;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.4);
`;

export interface DefaultSidebarProps {
  aliases: AliasMap;
  comments: CommentsMap;
  computeWidth: (id: string) => number;
  elementsToDelete: string[];
  fillColor: FillColor;
  getChildrenIdFromId: (id: string) => string[];
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  hoverSequence: string[];
  icicleHeight: number;
  icicleWidth: number;
  lockedSequence: string[];
  maxDepth: number;
  normalizeHeight: () => number;
  onBreadcrumbClick: IcicleMouseActionHandler;
  originalPath: string;
  rootId: string;
  tags: TagMap;
  zoomOffset: number;
  zoomRatio: number;
}

export const DefaultSidebar: React.FC<DefaultSidebarProps> = ({
  zoomOffset,
  zoomRatio,
  aliases,
  originalPath,
  fillColor,
  maxDepth,
  lockedSequence,
  hoverSequence,
  getFfByFfId,
  onBreadcrumbClick,
  comments,
  icicleWidth,
  icicleHeight,
  rootId,
  computeWidth,
  elementsToDelete,
  normalizeHeight,
  getChildrenIdFromId,
  tags,
}) => (
  <ColumnBlock>
    <BreadcrumbsWrapper>
      <BreadcrumbsNew
        aliases={aliases}
        originalPath={originalPath}
        fillColor={fillColor}
        depth={maxDepth}
        lockedSequence={lockedSequence}
        hoveredSequence={hoverSequence}
        getFfByFfId={getFfByFfId}
        onBreadcrumbClick={onBreadcrumbClick}
      />
    </BreadcrumbsWrapper>
    <MinimapWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
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
          viewportWidth={VIEWBOX_WIDTH}
          viewportHeight={VIEWBOX_HEIGHT}
        />
      </svg>
    </MinimapWrapper>
  </ColumnBlock>
);
