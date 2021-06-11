import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import Icicles from "./icicles";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  setHoveredElementId,
  setLockedElementId,
} from "reducers/workspace-metadata/workspace-metadata-actions";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";

const IciclesContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const { lockedElementId } = useSelector(getWorkspaceMetadataFromStore);

  const dispatch = useDispatch();

  const setHoveredElement = useCallback(
    (id) => dispatch(setHoveredElementId(id)),
    [dispatch]
  );

  const resetHoveredElement = useCallback(
    () => dispatch(setHoveredElementId("")),
    [dispatch]
  );

  const setLockedElement = useCallback(
    (id) => {
      dispatch(setLockedElementId(id));
    },
    [dispatch]
  );
  const resetLockedElement = useCallback(
    () => dispatch(setLockedElementId("")),
    [dispatch]
  );

  return (
    <Icicles
      filesAndFolders={filesAndFoldersMap}
      filesAndFoldersMetadata={filesAndFoldersMetadataMap}
      setHoveredElement={setHoveredElement}
      resetHoveredElement={resetHoveredElement}
      setLockedElement={setLockedElement}
      resetLockedElement={resetLockedElement}
      lockedElementId={lockedElementId}
    />
  );
};

export default IciclesContainer;
