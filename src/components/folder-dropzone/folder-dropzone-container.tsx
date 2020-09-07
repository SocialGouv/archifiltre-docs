import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
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

  return <FolderDropzone loadFromPath={loadFromPath} />;
};

export default FolderDropzoneContainer;
