import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  replayActionsThunk,
  usePreviousSession,
} from "reducers/middleware/persist-actions-middleware";
import { loadFilesAndFoldersFromPathThunk } from "reducers/store-thunks";
import FolderDropzone from "./folder-dropzone";

type FolderDropzoneContainerProps = {
  setLoadedPath: (path: string) => void;
};

const FolderDropzoneContainer: FC<FolderDropzoneContainerProps> = ({
  setLoadedPath,
}) => {
  const dispatch = useDispatch();

  const loadFromPath = useCallback(
    (path: string) => {
      setLoadedPath(path);
      dispatch(loadFilesAndFoldersFromPathThunk(path));
    },
    [dispatch, setLoadedPath]
  );

  const hasPreviousSession = usePreviousSession();

  const reloadPreviousSession = useCallback(() => {
    dispatch(replayActionsThunk());
  }, [dispatch]);

  return (
    <FolderDropzone
      loadFromPath={loadFromPath}
      hasPreviousSession={hasPreviousSession}
      reloadPreviousSession={reloadPreviousSession}
    />
  );
};

export default FolderDropzoneContainer;
