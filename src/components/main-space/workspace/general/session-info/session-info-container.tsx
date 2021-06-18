import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getSessionNameFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "reducers/workspace-metadata/workspace-metadata-thunk";
import SessionInfo from "./session-info";
import { getFirstLevelName } from "util/files-and-folders/file-and-folders-utils";

const SessionInfoContainer: FC = () => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const dispatch = useDispatch();

  const sessionName = useSelector(getSessionNameFromStore);

  const setSessionName = useCallback(
    (newSessionName) => dispatch(setSessionNameThunk(newSessionName)),
    [dispatch]
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

  const firstLevelName = getFirstLevelName(filesAndFolders);

  return (
    <SessionInfo
      firstLevelName={firstLevelName}
      sessionName={sessionName}
      onChangeSessionName={setSessionName}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      oldestFileTimestamp={oldestFileTimestamp}
      newestFileTimestamp={newestFileTimestamp}
    />
  );
};

export default SessionInfoContainer;
