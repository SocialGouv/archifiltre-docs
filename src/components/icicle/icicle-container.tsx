import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFilesAndFoldersFromStore,
  getMaxDepth
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import IcicleMain from "./icicle-main";

export default function IcicleApiToProps({
  api,
  fillColor,
  getChildrenIdFromId
}) {
  const icicle_state = api.icicle_state;
  const database = api.database;

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

  return (
    <IcicleMain
      api={api}
      display_root={icicle_state.display_root()}
      fillColor={fillColor}
      getChildrenIdFromId={getChildrenIdFromId}
      getFfByFfId={getFfByFfId}
      maxDepth={maxDepth}
      hover_sequence={icicle_state.hover_sequence()}
      isLocked={isLocked}
      lock={(...args) => {
        icicle_state.lock(...args);
        api.undo.commit();
      }}
      width_by_size={icicle_state.widthBySize()}
      root_id={database.rootFfId()}
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
