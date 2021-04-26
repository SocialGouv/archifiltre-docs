import React, { FC } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import Icicles from "./icicles";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";

const IciclesContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  return (
    <Icicles
      filesAndFolders={filesAndFoldersMap}
      filesAndFoldersMetadata={filesAndFoldersMetadataMap}
    />
  );
};

export default IciclesContainer;
