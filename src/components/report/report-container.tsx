import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "../../reducers/workspace-metadata/workspace-metadata-thunk";
import Report from "./report";

interface ReportContainerProps {
  api: any;
}

const ReportContainer: FC<ReportContainerProps> = ({ api }) => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const dispatch = useDispatch();

  const { sessionName } = useSelector(getWorkspaceMetadataFromStore);

  const setSessionName = useCallback(
    (newSessionName) => dispatch(setSessionNameThunk(newSessionName, api)),
    [dispatch, api]
  );

  const nbFiles = useMemo(() => getFileCount(filesAndFolders), [
    filesAndFolders,
  ]);
  const nbFolders = useMemo(() => getFoldersCount(filesAndFolders), [
    filesAndFolders,
  ]);
  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  const rootFilesAndFoldersMetadata = metadata[""] || {};

  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;
  const oldestFileTimestamp = rootFilesAndFoldersMetadata.minLastModified;
  const newestFileTimestamp = rootFilesAndFoldersMetadata.maxLastModified;

  return (
    <Report
      api={api}
      filesAndFolders={filesAndFolders}
      sessionName={sessionName}
      setSessionName={setSessionName}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      oldestFileTimestamp={oldestFileTimestamp}
      newestFileTimestamp={newestFileTimestamp}
    />
  );
};

export default ReportContainer;
