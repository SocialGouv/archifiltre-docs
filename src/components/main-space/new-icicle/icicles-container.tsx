import React, { FC } from "react";
import { useSelector } from "react-redux";
import {
  getFilesAndFoldersFromStore,
  getMaxDepth,
} from "reducers/files-and-folders/files-and-folders-selectors";
import Icicles from "./icicles";
import { IcicleOrientation } from "./icicle-types";

const IciclesContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const treeDepth = getMaxDepth(filesAndFoldersMap);
  const icicleOrientation = IcicleOrientation.VERTICAL;

  return (
    <Icicles
      filesAndFolders={filesAndFoldersMap}
      treeDepth={treeDepth}
      icicleOrientation={icicleOrientation}
    />
  );
};

export default IciclesContainer;
