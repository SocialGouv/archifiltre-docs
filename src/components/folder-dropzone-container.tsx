import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateFilesAndFolderHashes } from "../reducers/files-and-folders/files-and-folders-thunks";
import { HashesMap } from "../reducers/files-and-folders/files-and-folders-types";
import FolderDropzone from "./folder-dropzone";

const FolderDropzoneContainer: FC = props => {
  const dispatch = useDispatch();

  const setHashes = useCallback(
    (hashesMap: HashesMap) => {
      dispatch(updateFilesAndFolderHashes(hashesMap));
    },
    [dispatch]
  );
  return <FolderDropzone {...props} setHashes={setHashes} />;
};

export default FolderDropzoneContainer;
