import React, { FC, useEffect, useRef, useState } from "react";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getAllRects, getCurrentRect, getRectById } from "./icicles-utils";
import {
  createCell,
  createRect,
  createSvg,
  createTitle,
  createSubtitle,
  createPartition,
} from "./icicles-elements";

type IciclesProps = {
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  setHoveredElement: (id: string) => void;
  resetHoveredElement: () => void;
  setLockedElement: (id: string) => void;
  resetLockedElement: () => void;
  lockedElementId: string;
};

const Icicles: FC<IciclesProps> = ({
  filesAndFolders,
  setHoveredElement,
  setLockedElement,
  resetLockedElement,
  lockedElementId,
}) => {
  const [currentHoveredElementId, setCurrentHoveredElementId] = useState("");
  const [currentLockedElementId, setCurrentLockedElementId] = useState("");
  const iciclesRef = useRef(null);

  const root = createPartition(filesAndFolders);
  let focus = root;

  const handleResetLockedElement = ({ target, currentTarget }) => {
    if (target === currentTarget && currentLockedElementId.length) {
      resetLockedElement();
      setCurrentLockedElementId("");
      getAllRects(iciclesRef).style("fill-opacity", 0.5);
    }
  };

  const handleLockedElement = (_, lockedElement) => {
    if (lockedElement.data.id === currentLockedElementId) return;

    setLockedElement(lockedElement.data.id);
    setCurrentLockedElementId(lockedElement.data.id);
    getCurrentRect(iciclesRef, lockedElement).style("fill-opacity", 1);

    currentLockedElementId.length
      ? getRectById(iciclesRef, currentLockedElementId).style(
          "fill-opacity",
          0.5
        )
      : null;
  };

  const handleSetCurrentHoveredElementId = (_, hoveredElement) => {
    if (hoveredElement.data.id === currentLockedElementId) return;

    setCurrentHoveredElementId(hoveredElement.data.id);
    getCurrentRect(iciclesRef, hoveredElement).style("fill-opacity", 0.75);
  };

  const handleResetCurrentHoveredElementId = (_, hoveredElement) => {
    if (hoveredElement.data.id === currentLockedElementId) return;

    setCurrentHoveredElementId("");
    getCurrentRect(iciclesRef, hoveredElement).style("fill-opacity", 0.5);
  };

  useEffect(() => {
    if (!lockedElementId) {
      setHoveredElement(currentHoveredElementId);
    }
  }, [lockedElementId, setHoveredElement, currentHoveredElementId]);

  useEffect(() => {
    const iciclesElements = {};

    const svg = createSvg(iciclesRef);
    const cell = createCell(svg, root);
    const rect = createRect(cell, iciclesElements);
    const title = createTitle(cell);
    const subtitle = createSubtitle(title);

    Object.assign(iciclesElements, {
      root,
      focus,
      cell,
      rect,
      title,
      subtitle,
    });
  }, []);

  useEffect(() => {
    getAllRects(iciclesRef)
      .on("click", handleLockedElement)
      .on("mouseover", handleSetCurrentHoveredElementId)
      .on("mouseout", handleResetCurrentHoveredElementId);
  }, [currentLockedElementId, iciclesRef]);

  return (
    <svg ref={iciclesRef} id="icicles" onClick={handleResetLockedElement} />
  );
};

export default Icicles;
