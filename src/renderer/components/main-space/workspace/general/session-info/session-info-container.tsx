import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getSessionNameFromStore } from "../../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "../../../../../reducers/workspace-metadata/workspace-metadata-thunk";
import { getFirstLevelName } from "../../../../../utils/file-and-folders-utils";
import type { SessionInfoProps } from "./session-info";
import { SessionInfo } from "./session-info";

export const SessionInfoContainer: React.FC = () => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const dispatch = useDispatch();

  const sessionName = useSelector(getSessionNameFromStore);

  const setSessionName: SessionInfoProps["onChangeSessionName"] = useCallback(
    (newSessionName) => dispatch(setSessionNameThunk(newSessionName)),
    [dispatch]
  );

  const nbFiles = useMemo(
    () => getFileCount(filesAndFolders),
    [filesAndFolders]
  );
  const nbFolders = useMemo(
    () => getFoldersCount(filesAndFolders),
    [filesAndFolders]
  );
  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      oldestFileTimestamp={oldestFileTimestamp}
      newestFileTimestamp={newestFileTimestamp}
    />
  );
};
