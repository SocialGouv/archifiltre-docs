import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAreHashesReady } from "reducers/files-and-folders/files-and-folders-selectors";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { exportConfig, ExportType } from "./export-config";
import ExportModalContent from "./export-modal-content";

const ExportModalContentContainer: FC = () => {
  const { originalPath, sessionName } = useSelector(
    getWorkspaceMetadataFromStore
  );
  const areHashesReady = useSelector(getAreHashesReady);

  const dispatch = useDispatch();

  const startExport = (exportId: ExportType, exportPath: string) => {
    const { exportFunction } = exportConfig[exportId];
    dispatch(exportFunction(exportPath));
  };

  return (
    <ExportModalContent
      areHashesReady={areHashesReady}
      originalPath={originalPath}
      sessionName={sessionName}
      startExport={startExport}
    />
  );
};

export default ExportModalContentContainer;
