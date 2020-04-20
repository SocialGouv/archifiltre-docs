import styled from "styled-components";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import React, { FC, useEffect, useRef, useState } from "react";
import { Dims } from "./icicle/icicle-rect";
import {
  isFile,
  ROOT_FF_ID,
} from "reducers/files-and-folders/files-and-folders-selectors";
import translations from "translations/translations";
import { percent } from "util/numbers/numbers-util";
import { FillColor } from "./icicle/icicle-types";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";

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
  x: 0,
  dx: 0,
  y: 0,
  dy: 0,
};

/**
 * Get the number of child files from a node
 * @param node
 */
const getFilesAndFoldersCount = (
  node: FilesAndFolders & FilesAndFoldersMetadata
) => {
  return isFile(node)
    ? null
    : `${node.nbChildrenFiles} ${translations.t("common.files")}`;
};

/**
 * Returns a formatted text with the size percentage of the file or folder
 * @param nodeSize
 * @param totalSize
 * @returns {string}
 */
const makePercentageText = (nodeSize: number, totalSize: number) => {
  const percentage = percent(nodeSize, totalSize, { numbersOfDecimals: 1 });
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
  rootNode: FilesAndFolders & FilesAndFoldersMetadata
) => {
  const { childrenTotalSize } = node;
  const { childrenTotalSize: rootChildrenTotalSize } = rootNode;
  const percentageText = makePercentageText(
    childrenTotalSize,
    rootChildrenTotalSize
  );
  const filesAndFolderSize = octet2HumanReadableFormat(childrenTotalSize);
  const rulerInfo = [percentageText, filesAndFolderSize];
  const filesAndFoldersNumber = getFilesAndFoldersCount(node);
  if (filesAndFoldersNumber) {
    rulerInfo.push(filesAndFoldersNumber);
  }

  return rulerInfo.join(" | ");
};

interface RulerProps {
  widthUnit: number;
  totalSize: number;
  hoveredDims: Dims | null;
  lockedDims: Dims | null;
  lockedElementId: string;
  hoveredElementId: string;
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  fillColor: FillColor;
}

const Ruler: FC<RulerProps> = ({
  widthUnit,
  totalSize,
  hoveredDims = EmptyDims,
  hoveredElementId,
  lockedDims = EmptyDims,
  lockedElementId,
  getFfByFfId,
  fillColor,
}) => {
  const elementDims =
    (hoveredElementId ? hoveredDims : lockedDims) || EmptyDims;
  const elementId = hoveredElementId || lockedElementId;

  const rulerText = elementId
    ? makeRulerText(getFfByFfId(elementId), getFfByFfId(ROOT_FF_ID))
    : "";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [textMargin, setTextMargin] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef?.current;
    const text = textRef?.current;
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
          marginLeft: `${(elementDims.x / widthUnit) * 100}%`,
          backgroundColor: fillColor(elementId),
          width: `${(elementDims.dx / totalSize) * 100}%`,
        }}
      />
      <RulerTextWrapper style={{ marginLeft: `${textMargin}px` }}>
        <span ref={textRef}>{rulerText}</span>
      </RulerTextWrapper>
    </RulerWrapper>
  );
};

export default Ruler;
