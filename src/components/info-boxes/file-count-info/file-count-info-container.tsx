import { useSelector } from "react-redux";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import React, { FC, useMemo } from "react";
import FileCountInfo from "./file-count-info";

const FileCountInfoContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);

  const fileCount = useMemo(() => getFileCount(filesAndFoldersMap), [
    filesAndFoldersMap,
  ]);

  return <FileCountInfo fileCount={fileCount} />;
};

export default FileCountInfoContainer;
