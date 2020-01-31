import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { loadFilesAndFoldersFromPathThunk } from "../../reducers/store-thunks";
import FolderDropzone from "./folder-dropzone";

const FolderDropzoneContainer: FC = props => {
  const dispatch = useDispatch();

  const loadFromPath = useCallback(
    (path: string, { api, t }: any) =>
      dispatch(loadFilesAndFoldersFromPathThunk(path, { api, t })),
    [dispatch]
  );

  return <FolderDropzone {...props} loadFromPath={loadFromPath} />;
};

export default FolderDropzoneContainer;
