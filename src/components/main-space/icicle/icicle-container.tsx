import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getFilesToDeleteFromStore,
  getMaxDepth,
  getVirtualPathToIdFromStore,
  ROOT_FF_ID,
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
import { IciclesSortMethod } from "reducers/workspace-metadata/workspace-metadata-types";
import { useFillColor } from "util/color/color-util";
import { createFilePathSequence } from "util/files-and-folders/file-and-folders-utils";
import IcicleMain from "./icicle-main";

export default function IcicleApiToProps({ api }) {
  const icicle_state = api.icicle_state;
  const displayRoot = icicle_state.display_root();

  const dispatch = useDispatch();

  const tags = useSelector(getTagsFromStore);

  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const virtualPathToIdMap = useSelector(getVirtualPathToIdFromStore);

  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const aliases = useSelector(getAliasesFromStore);
  const comments = useSelector(getCommentsFromStore);
  const elementsToDelete = useSelector(getFilesToDeleteFromStore);

  const {
    iciclesSortMethod,
    hoveredElementId,
    lockedElementId,
  } = useWorkspaceMetadata();

  const getFfByFfId = useCallback(
    (ffId: string) => ({
      ...filesAndFoldersMetadata[ffId],
      ...filesAndFolders[ffId],
    }),
    [filesAndFoldersMetadata, filesAndFolders]
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
        [IciclesSortMethod.SORT_BY_DATE]: metadata.sortByDateIndex,
        [IciclesSortMethod.SORT_BY_TYPE]: metadata.sortBySizeIndex,
        [IciclesSortMethod.SORT_ALPHA_NUMERICALLY]:
          metadata.sortAlphaNumericallyIndex,
      }[iciclesSortMethod];
      return orderArray.map((childIndex) => children[childIndex]);
    },
    [filesAndFolders, filesAndFoldersMetadata, iciclesSortMethod]
  );

  const fillColor = useFillColor(
    filesAndFolders,
    filesAndFoldersMetadata,
    iciclesSortMethod,
    displayRoot
  );

  const moveElementCallback = useCallback(
    (movedElement, targetFolder) =>
      dispatch(moveElement(movedElement, targetFolder)),
    [dispatch]
  );

  return (
    <IcicleMain
      api={api}
      aliases={aliases}
      comments={comments}
      display_root={icicle_state.display_root()}
      originalPath={originalPath}
      fillColor={fillColor}
      getChildrenIdFromId={getChildrenIdFromId}
      elementsToDelete={elementsToDelete}
      getFfByFfId={getFfByFfId}
      maxDepth={maxDepth}
      hoveredElementId={hoveredElementId}
      lockedElementId={lockedElementId}
      hoverSequence={hoverSequence}
      lockedSequence={lockedSequence}
      lock={lock}
      width_by_size={icicle_state.widthBySize()}
      root_id={ROOT_FF_ID}
      setDisplayRoot={icicle_state.setDisplayRoot}
      setFocus={setFocus}
      setNoFocus={setNoFocus}
      setNoHover={setNoFocus}
      moveElement={moveElementCallback}
      tags={tags}
      unlock={unlock}
    />
  );
}
