import React, { FC, useCallback } from "react";
import { useSelector } from "react-redux";

import { getFilesAndFoldersMetadataFromStore } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";
import Workspace from "./workspace";

interface WorkspaceContainerProps {
  api: any;
}

const WorkspaceContainer: FC<WorkspaceContainerProps> = ({ api }) => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const getFfByFfId = useCallback(
    id => ({ ...filesAndFolders[id], ...filesAndFoldersMetadata[id] }),
    [filesAndFolders, filesAndFoldersMetadata]
  );
  return <Workspace api={api} getFfByFfId={getFfByFfId} />;
};

export default WorkspaceContainer;
