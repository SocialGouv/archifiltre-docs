import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  getFilesCount,
  getFilesAndFoldersFromStore,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { FileCountInfo } from "./file-count-info";

export const FileCountInfoContainer: React.FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);

  const fileCount = useMemo(
    () => getFilesCount(filesAndFoldersMap),
    [filesAndFoldersMap]
  );

  return <FileCountInfo fileCount={fileCount} />;
};
