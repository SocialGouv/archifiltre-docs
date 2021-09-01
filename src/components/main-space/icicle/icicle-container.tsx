import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getElementsToDeleteFromStore,
  getMaxDepth,
  getVirtualPathToIdFromStore,
  ROOT_FF_ID,
  isFolder,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { moveElement } from "reducers/files-and-folders/files-and-folders-thunks";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import {
  setHoveredElementId,
  setLockedElementId,
} from "reducers/workspace-metadata/workspace-metadata-actions";
import {
  getWorkspaceMetadataFromStore,
  useWorkspaceMetadata,
} from "reducers/workspace-metadata/workspace-metadata-selectors";
import { useFillColor } from "util/color/color-util";
import {
  createFilePathSequence,
  getAllChildren,
} from "util/files-and-folders/file-and-folders-utils";
import IcicleMain from "./icicle-main";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { useIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-selectors";

export default function IcicleApiToProps() {
  const dispatch = useDispatch();

  const tags = useSelector(getTagsFromStore);

  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const virtualPathToIdMap = useSelector(getVirtualPathToIdFromStore);

  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const aliases = useSelector(getAliasesFromStore);
  const comments = useSelector(getCommentsFromStore);
  const elementsToDelete = useSelector(getElementsToDeleteFromStore);

  const { hoveredElementId, lockedElementId } = useWorkspaceMetadata();

  const {
    icicleSortMethod,
    icicleColorMode,
    elementWeightMethod,
  } = useIcicleSortMethod();

  const getFfByFfId = useCallback(
    (ffId: string) => ({
      ...filesAndFoldersMetadata[ffId],
      ...filesAndFolders[ffId],
    }),
    [filesAndFoldersMetadata, filesAndFolders]
  );

  const getAllChildrenFolderCount = useCallback(
    (id: string) => {
      const children = getAllChildren(filesAndFolders, id);
      return children.map(getFfByFfId).filter(isFolder).length - 1;
    },
    [filesAndFolders]
  );

  const maxDepth = useMemo(() => getMaxDepth(filesAndFolders), [
    filesAndFolders,
  ]);

  const lock = useCallback(
    (id) => {
      dispatch(setLockedElementId(id));
    },
    [dispatch]
  );

  const setFocus = useCallback((id) => dispatch(setHoveredElementId(id)), [
    dispatch,
  ]);

  const setNoFocus = useCallback(() => dispatch(setHoveredElementId("")), [
    dispatch,
  ]);

  const unlock = useCallback(() => dispatch(setLockedElementId("")), [
    dispatch,
  ]);

  const hoverSequence = useMemo(
    () =>
      createFilePathSequence(
        hoveredElementId,
        filesAndFolders,
        virtualPathToIdMap
      ),
    [hoveredElementId, filesAndFolders, virtualPathToIdMap]
  );

  const lockedSequence = useMemo(
    () =>
      createFilePathSequence(
        lockedElementId,
        filesAndFolders,
        virtualPathToIdMap
      ),
    [lockedElementId, filesAndFolders, virtualPathToIdMap]
  );

  const { originalPath } = useSelector(getWorkspaceMetadataFromStore);

  const getChildrenIdFromId = useCallback(
    (id: string): string[] => {
      const children = filesAndFolders[id].children;
      const metadata = filesAndFoldersMetadata[id];
      const orderArray = {
        [IcicleSortMethod.SORT_BY_DATE]: metadata.sortByDateIndex,
        [IcicleSortMethod.SORT_BY_SIZE]: metadata.sortBySizeIndex,
        [IcicleSortMethod.SORT_ALPHA_NUMERICALLY]:
          metadata.sortAlphaNumericallyIndex,
      }[icicleSortMethod];
      return orderArray.map((childIndex) => children[childIndex]);
    },
    [filesAndFolders, filesAndFoldersMetadata, icicleSortMethod]
  );

  const fillColor = useFillColor(
    filesAndFolders,
    filesAndFoldersMetadata,
    icicleColorMode
  );

  const moveElementCallback = useCallback(
    (movedElement, targetFolder) =>
      dispatch(moveElement(movedElement, targetFolder)),
    [dispatch]
  );

  return (
    <IcicleMain
      aliases={aliases}
      comments={comments}
      originalPath={originalPath}
      fillColor={fillColor}
      getChildrenIdFromId={getChildrenIdFromId}
      getAllChildrenFolderCount={getAllChildrenFolderCount}
      elementsToDelete={elementsToDelete}
      getFfByFfId={getFfByFfId}
      maxDepth={maxDepth}
      hoveredElementId={hoveredElementId}
      lockedElementId={lockedElementId}
      hoverSequence={hoverSequence}
      lockedSequence={lockedSequence}
      lock={lock}
      elementWeightMethod={elementWeightMethod}
      rootId={ROOT_FF_ID}
      setFocus={setFocus}
      setNoFocus={setNoFocus}
      setNoHover={setNoFocus}
      moveElement={moveElementCallback}
      tags={tags}
      unlock={unlock}
    />
  );
}
