import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { computeHashesThunk } from "../../hash-computer/hash-computer-thunk";
import FolderDropzone from "./folder-dropzone";

const FolderDropzoneContainer: FC = props => {
  const dispatch = useDispatch();

  const computeHashes = useCallback(
    (originalPath: string) => dispatch(computeHashesThunk(originalPath)),
    [dispatch]
  );
  return <FolderDropzone {...props} computeHashes={computeHashes} />;
};

export default FolderDropzoneContainer;
