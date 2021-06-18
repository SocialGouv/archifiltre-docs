import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getAncestorsPath,
  getAllRects,
  switchOpacityDifferences,
  switchMultipleOpacity,
} from "./icicles-utils";
import {
  createCell,
  createRect,
  createSvg,
  createTitle,
  createSubtitle,
  createPartition,
} from "./icicles-elements";
import { difference } from "lodash";

type IciclesProps = {
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  setHoveredElement: (id: string) => void;
  resetHoveredElement: () => void;
  setLockedElement: (id: string) => void;
  resetLockedElement: () => void;
  lockedElementId: string;
  treeDepth: number;
};

const Icicles: FC<IciclesProps> = ({
  filesAndFolders,
  setHoveredElement,
  setLockedElement,
  resetLockedElement,
  lockedElementId,
  treeDepth,
}) => {
  const iciclesRef = useRef(null);
  const lockedPathRef = useRef<string[]>([]);
  const hoveredPathRef = useRef<string[]>([]);

  const root = useMemo(() => createPartition(filesAndFolders), [
    filesAndFolders,
  ]);
  let focus = root;

  const handleResetLockedElement = ({ target, currentTarget }) => {
    if (target === currentTarget) {
      resetLockedElement();
      switchMultipleOpacity(lockedPathRef.current, 0.5);
      lockedPathRef.current = [];
    }
  };

  const handleLockedElement = (_, { data: { id } }) => {
    setLockedElement(id);
  };

  const handleSetCurrentHoveredElementId = (_, { data: { id } }) => {
    const ancestorsPaths = getAncestorsPath(id, treeDepth);
    const removeOpacity = difference(hoveredPathRef.current, [
      ...ancestorsPaths,
      ...lockedPathRef.current,
    ]);
    const addOpacity = difference(ancestorsPaths, [
      ...lockedPathRef.current,
      ...hoveredPathRef.current,
    ]);

    switchMultipleOpacity(removeOpacity, 0.5);
    switchMultipleOpacity(addOpacity, 0.75);

    hoveredPathRef.current = ancestorsPaths;

    setHoveredElement(id);
  };

  const handleResetCurrentHoveredElementId = ({ target, currentTarget }) => {
    if (target === currentTarget && hoveredPathRef.current.length > 0) {
      const removeOpacity = difference(
        hoveredPathRef.current,
        lockedPathRef.current
      );
      switchMultipleOpacity(removeOpacity, 0.5);
      hoveredPathRef.current = [];

      setHoveredElement("");
    }
  };

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
    const ancestorsPaths = getAncestorsPath(lockedElementId, treeDepth);
    switchOpacityDifferences(lockedPathRef.current, ancestorsPaths, 0.5, 1);
    lockedPathRef.current = ancestorsPaths;
  }, [lockedElementId]);

  useEffect(() => {
    getAllRects()
      .on("click", handleLockedElement)
      .on("mouseover", handleSetCurrentHoveredElementId);
  }, []);

  return (
    <svg
      ref={iciclesRef}
      id="icicles"
      onClick={handleResetLockedElement}
      onMouseMove={handleResetCurrentHoveredElementId}
    />
  );
};

export default Icicles;
