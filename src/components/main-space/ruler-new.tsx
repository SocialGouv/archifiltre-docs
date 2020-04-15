import styled from "styled-components";
import { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import React, { FC } from "react";
import { Dims } from "./icicle/icicle-rect";
import { octet2HumanReadableFormat } from "./ruler";
import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";
import translations from "../../translations/translations";
import { percent } from "../../util/numbers-util";

const RulerWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const RulerMarker = styled.div`
  width: 100%;
  height: 15%;
  border: 1px solid white;
`;

const RulerText = styled.div`
  width: 100%;
  text-align: center;
  overflow: visible;
  white-space: nowrap;
`;

const EmptyDims: Dims = {
  x: 0,
  dx: 0,
  y: 0,
  dy: 0,
};

const getFilesAndFoldersNumber = (node) => {
  return isFile(node)
    ? null
    : `${node.nbChildrenFiles} ${translations.t("common.files")}`;
};

/**
 * Returns a formatted text with the file or folder size and the number of files in it (for a folder only)
 * @param nodeSize
 * @param totalSize
 * @param node
 * @returns {string}
 */
const makeRulerText = (nodeSize, totalSize, node) => {
  const filesAndFolderSize = octet2HumanReadableFormat(nodeSize);
  const rulerInfo = ["", filesAndFolderSize];
  const filesAndFoldersNumber = getFilesAndFoldersNumber(node);
  if (filesAndFoldersNumber) rulerInfo.push(filesAndFoldersNumber);

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
}

const Ruler: FC<RulerProps> = ({
  widthUnit,
  totalSize,
  hoveredDims = EmptyDims,
  hoveredElementId,
  lockedDims = EmptyDims,
  lockedElementId,
  getFfByFfId,
}) => {
  const elementDims =
    (hoveredElementId ? hoveredDims : lockedDims) || EmptyDims;
  const elementId = hoveredElementId || lockedElementId;
  const { childrenTotalSize } = getFfByFfId(elementId);
  return (
    <RulerWrapper>
      <div
        style={{
          top: "10%",
          marginLeft: `${(elementDims.x / widthUnit) * 100}%`,
          height: "90%",
          width: `${(elementDims.dx / totalSize) * 100}%`,
        }}
      >
        <RulerMarker style={{ backgroundColor: "red" }} />
        <RulerText>
          {octet2HumanReadableFormat(childrenTotalSize)} |{" "}
          {percent(elementDims.x, widthUnit, { numbersOfDecimals: 2 })} %
        </RulerText>
      </div>
    </RulerWrapper>
  );
};

export default Ruler;
