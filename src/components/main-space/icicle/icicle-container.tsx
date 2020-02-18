import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  decomposePathToElement,
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getFilesToDeleteFromStore,
  getMaxDepth,
  getVirtualPathToIdFromStore,
  ROOT_FF_ID,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { moveElement } from "../../../reducers/files-and-folders/files-and-folders-thunks";
import { getTagsFromStore } from "../../../reducers/tags/tags-selectors";
import { setHoveredElementId } from "../../../reducers/workspace-metadata/workspace-metadata-actions";
import {
  getWorkspaceMetadataFromStore,
  useWorkspaceMetadata,
} from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { IciclesSortMethod } from "../../../reducers/workspace-metadata/workspace-metadata-types";
import { useFillColor } from "../../../util/color-util";
import IcicleMain from "./icicle-main";

export default function IcicleApiToProps({ api }) {
  const icicle_state = api.icicle_state;
  const lockSequence = icicle_state.lock_sequence();
  const displayRoot = icicle_state.display_root();
  const isLocked = lockSequence.length > 0;

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

  const { iciclesSortMethod, hoveredElementId } = useWorkspaceMetadata();

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
    (...args) => {
      icicle_state.lock(...args);
      api.undo.commit();
    },
    [icicle_state.lock, api.undo.commit]
  );

  const setFocus = useCallback((id) => dispatch(setHoveredElementId(id)), [
    dispatch,
  ]);

  const setNoFocus = useCallback(() => dispatch(setHoveredElementId("")), [
    dispatch,
  ]);

  const hoverSequence = useMemo(() => {
    const { virtualPath: hoveredElementVirtualPath } = filesAndFolders[
      hoveredElementId
    ];
    return decomposePathToElement(hoveredElementVirtualPath)
      .slice(1)
      .map((virtualPath) => virtualPathToIdMap[virtualPath] || virtualPath);
  }, [hoveredElementId, filesAndFolders, virtualPathToIdMap]);

  const { originalPath } = useSelector(getWorkspaceMetadataFromStore);

  const getChildrenIdFromId = useCallback(
    (id: string): string[] => {
      const children = filesAndFolders[id].children;
      const metadata = filesAndFoldersMetadata[id];
      const orderArray =
        iciclesSortMethod === IciclesSortMethod.SORT_BY_DATE
          ? metadata.sortByDateIndex
          : metadata.sortBySizeIndex;
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
      hoverSequence={hoverSequence}
      isLocked={isLocked}
      lock={lock}
      width_by_size={icicle_state.widthBySize()}
      root_id={ROOT_FF_ID}
      sequence={icicle_state.sequence()}
      setDisplayRoot={icicle_state.setDisplayRoot}
      setFocus={setFocus}
      setNoFocus={setNoFocus}
      setNoHover={setNoFocus}
      moveElement={moveElementCallback}
      tags={tags}
      unlock={icicle_state.unlock}
    />
  );
}
