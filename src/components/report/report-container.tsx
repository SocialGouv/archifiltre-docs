import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
  getHashesFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { updateAliasThunk } from "reducers/files-and-folders/files-and-folders-thunks";
import { StoreState } from "reducers/store";
import {
  getWorkspaceMetadataFromStore,
  useWorkspaceMetadata,
} from "reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "../../reducers/workspace-metadata/workspace-metadata-thunk";
import Report from "./report";

interface ReportContainerProps {
  api: any;
}

const ReportContainer: FC<ReportContainerProps> = ({ api }) => {
  const { hoveredElementId, lockedElementId } = useWorkspaceMetadata();

  const filesAndFoldersId = lockedElementId || hoveredElementId;

  const currentFileAlias =
    useSelector(getAliasesFromStore)[filesAndFoldersId] || "";

  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const currentFileHash = useSelector((state: StoreState) =>
    getHashesFromStore(state)
  )[filesAndFoldersId];

  const dispatch = useDispatch();

  const updateAlias = useCallback(
    (alias) => {
      dispatch(updateAliasThunk(filesAndFoldersId, alias));
      api.undo.commit();
    },
    [dispatch, api, filesAndFoldersId]
  );

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
      isLocked={lockedElementId !== ""}
      currentFileHash={currentFileHash}
      currentFileAlias={currentFileAlias}
      filesAndFolders={filesAndFolders}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      updateAlias={updateAlias}
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
