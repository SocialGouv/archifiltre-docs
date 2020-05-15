import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  getFilesAndFoldersFromStore,
  getMaxDepth,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import FileTreeDepth from "./file-tree-depth";

const FileTreeDepthContainer: FC = () => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const depth = useMemo(() => getMaxDepth(filesAndFolders), [filesAndFolders]);

  return <FileTreeDepth fileTreeDepth={depth} />;
};

export default FileTreeDepthContainer;
