import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { loadFilesAndFoldersFromPathThunk } from "../../reducers/store-thunks";
import FolderDropzone from "./folder-dropzone";

interface FolderDropzoneContainerProps {
  api: any;
  setLoadedPath: (path: string) => void;
}

const FolderDropzoneContainer: FC<FolderDropzoneContainerProps> = ({
  api,
  setLoadedPath,
}) => {
  const dispatch = useDispatch();

  const loadFromPath = useCallback(
    (path: string) => {
      setLoadedPath(path);
      dispatch(loadFilesAndFoldersFromPathThunk(path, { api }));
    },
    [dispatch, api, setLoadedPath]
  );

  return <FolderDropzone loadFromPath={loadFromPath} />;
};

export default FolderDropzoneContainer;
