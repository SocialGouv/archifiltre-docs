import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getArchiveFoldersCount,
  getFilesAndFoldersFromStore,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getSessionNameFromStore } from "../../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "../../../../../reducers/workspace-metadata/workspace-metadata-thunk";
import { getFilesCount, getFoldersCount } from "../../../../../utils";
import { getFirstLevelName } from "../../../../../utils/file-and-folders";
import { SessionInfo, type SessionInfoProps } from "./session-info";

export const SessionInfoContainer: React.FC = () => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const dispatch = useDispatch();

  const sessionName = useSelector(getSessionNameFromStore);

  const setSessionName: SessionInfoProps["onChangeSessionName"] = useCallback(
    newSessionName => dispatch(setSessionNameThunk(newSessionName)),
    [dispatch],
  );

  const filesCount = useMemo(() => getFilesCount(filesAndFolders), [filesAndFolders]);
  const foldersCount = useMemo(() => getFoldersCount(filesAndFolders), [filesAndFolders]);
  const archiveFoldersCount = useMemo(() => getArchiveFoldersCount(filesAndFolders), [filesAndFolders]);

  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);

  const rootFilesAndFoldersMetadata = metadata[""] ?? {};

  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;
  const oldestFileTimestamp = rootFilesAndFoldersMetadata.minLastModified;
  const newestFileTimestamp = rootFilesAndFoldersMetadata.maxLastModified;

  const firstLevelName = getFirstLevelName(filesAndFolders);

  return (
    <SessionInfo
      firstLevelName={firstLevelName}
      sessionName={sessionName}
      onChangeSessionName={setSessionName}
      filesCount={filesCount}
      foldersCount={foldersCount - archiveFoldersCount}
      archivesCount={archiveFoldersCount}
      volume={volume}
      oldestFileTimestamp={oldestFileTimestamp}
      newestFileTimestamp={newestFileTimestamp}
    />
  );
};
