import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFilesAndFoldersFromStore,
  getMaxDepth,
  ROOT_FF_ID
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../../../reducers/tags/tags-selectors";
import { getWorkspaceMetadataFromStore } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import IcicleMain from "./icicle-main";

export default function IcicleApiToProps({
  api,
  fillColor,
  getChildrenIdFromId
}) {
  const icicle_state = api.icicle_state;

  const lockSequence = icicle_state.lock_sequence();
  const isLocked = lockSequence.length > 0;
  const tags = useSelector(getTagsFromStore);

  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const getFfByFfId = useCallback(
    (ffId: string) => ({
      ...filesAndFoldersMetadata[ffId],
      ...filesAndFolders[ffId]
    }),
    [filesAndFoldersMetadata, filesAndFolders]
  );

  const maxDepth = useMemo(() => getMaxDepth(filesAndFolders), [
    filesAndFolders
  ]);

  const lock = useCallback(
    (...args) => {
      icicle_state.lock(...args);
      api.undo.commit();
    },
    [icicle_state.lock, api.undo.commit]
  );

  const { originalPath } = useSelector(getWorkspaceMetadataFromStore);

  return (
    <IcicleMain
      api={api}
      display_root={icicle_state.display_root()}
      originalPath={originalPath}
      fillColor={fillColor}
      getChildrenIdFromId={getChildrenIdFromId}
      getFfByFfId={getFfByFfId}
      maxDepth={maxDepth}
      hover_sequence={icicle_state.hover_sequence()}
      isLocked={isLocked}
      lock={lock}
      width_by_size={icicle_state.widthBySize()}
      root_id={ROOT_FF_ID}
      sequence={icicle_state.sequence()}
      setDisplayRoot={icicle_state.setDisplayRoot}
      setFocus={icicle_state.setFocus}
      setNoFocus={icicle_state.setNoFocus}
      setNoHover={icicle_state.setNoHover}
      tags={tags}
      unlock={icicle_state.unlock}
    />
  );
}
