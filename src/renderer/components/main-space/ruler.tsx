import { getPercentage } from "@common/utils/numbers";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { translations } from "../../translations/translations";
import { bytes2HumanReadableFormat, isFolder } from "../../utils";
import type { Dims } from "./icicle/icicle-rect";
import type { FillColor } from "./icicle/icicle-types";

const RulerWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const RulerMarker = styled.div`
  width: 100%;
  height: 15%;
  border: 1px solid white;
`;

const RulerTextWrapper = styled.div`
  white-space: nowrap;
`;

/**
 * Dummy dims
 */
const EmptyDims: Dims = {
  dx: 0,
  dy: 0,
  x: 0,
  y: 0,
};

/**
 * Get the number of child files from a node
 * @param node
 */
const getFilesCount = (node: FilesAndFoldersMetadata): string =>
  `${node.nbChildrenFiles} ${translations.t("common.files")}`;

/**
 * Get the number of child folders from a node
 * @param node
 */
const getFoldersCount = (
  node: FilesAndFolders,
  getAllChildrenFolderCount: (id: string) => number
): string => {
  const foldersCount = getAllChildrenFolderCount(node.id);
  return `${foldersCount} ${translations.t("common.folders")}`;
};

/**
 * Returns a formatted text with the size percentage of the file or folder
 */
const makePercentageText = (nodeSize: number, totalSize: number): string => {
  const percentage = getPercentage(nodeSize, totalSize, 1);
  return percentage < 0.1 ? "< 0.1%" : `${percentage}%`;
};

/**
 * Returns a formatted text with the file or folder size and the number of files in it (for a folder only)
 * @param node
 * @param rootNode
 * @returns {string}
 */
const makeRulerText = (
  node: FilesAndFolders & FilesAndFoldersMetadata,
  rootNode: FilesAndFolders & FilesAndFoldersMetadata,
  getAllChildrenFolderCount: (id: string) => number
) => {
  const { childrenTotalSize } = node;
  const { childrenTotalSize: rootChildrenTotalSize } = rootNode;
  const percentageText = makePercentageText(
    childrenTotalSize,
    rootChildrenTotalSize
  );
  const filesAndFolderSize = bytes2HumanReadableFormat(childrenTotalSize);
  const rulerInfo = [percentageText, filesAndFolderSize];

  if (isFolder(node)) {
    rulerInfo.push(getFoldersCount(node, getAllChildrenFolderCount));
    rulerInfo.push(getFilesCount(node));
  }

  return rulerInfo.join(" | ");
};

export interface RulerProps {
  fillColor: FillColor;
  getAllChildrenFolderCount: (id: string) => number;
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  hoveredDims: Dims | null;
  hoveredElementId: string;
  lockedDims: Dims | null;
  lockedElementId: string;
  totalSize: number;
  widthUnit: number;
}

export const Ruler: React.FC<RulerProps> = ({
  widthUnit,
  totalSize,
  hoveredDims = EmptyDims,
  hoveredElementId,
  lockedDims = EmptyDims,
  lockedElementId,
  getAllChildrenFolderCount,
  getFfByFfId,
  fillColor,
}) => {
  const elementDims =
    (hoveredElementId ? hoveredDims : lockedDims) ?? EmptyDims;
  const elementId = hoveredElementId || lockedElementId;

  const rulerText = elementId
    ? makeRulerText(
        getFfByFfId(elementId),
        getFfByFfId(ROOT_FF_ID),
        getAllChildrenFolderCount
      )
    : "";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [textMargin, setTextMargin] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;
    if (wrapper && text) {
      const { width: wrapperWidth } = wrapper.getBoundingClientRect();
      const { width: textWidth } = text.getBoundingClientRect();

      const rulerWidth = (elementDims.dx / totalSize) * wrapperWidth;

      const rawTextMargin =
        (wrapperWidth * elementDims.x) / widthUnit +
        rulerWidth / 2 -
        textWidth / 2;

      const normalizedTextMargin = Math.min(
        Math.max(0, rawTextMargin),
        wrapperWidth - textWidth
      );

      setTextMargin(normalizedTextMargin);
    }
  }, [rulerText, wrapperRef, textRef, elementDims, widthUnit, totalSize]);

  if (!elementId) {
    return null;
  }

  return (
    <RulerWrapper ref={wrapperRef}>
      <RulerMarker
        style={{
          backgroundColor: fillColor(elementId),
          marginLeft: `${Math.max(0, (elementDims.x / widthUnit) * 100)}%`,
          width: `${Math.min(100, (elementDims.dx / totalSize) * 100)}%`,
        }}
      />
      <RulerTextWrapper style={{ marginLeft: `${textMargin}px` }}>
        <span ref={textRef}>{rulerText}</span>
      </RulerTextWrapper>
    </RulerWrapper>
  );
};
